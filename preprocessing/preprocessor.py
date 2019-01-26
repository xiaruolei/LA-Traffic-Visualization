import csv
import json
from datetime import datetime
import numpy as np
import matplotlib.pyplot as plt

from geojson import Point, Feature, FeatureCollection, dump

class Preprocessor:

    def __init__(self):
        self.collision_types=set()
        self.dataset=[]

        self.initCollisionTypes()
    def readfile(self, rfile_name,filterType=[]):
        dataset =[]
        with open(rfile_name, 'r') as rfile:
            csv_reader = csv.DictReader(rfile,delimiter=',')
            for row in csv_reader:
                if (len(filterType)>0 and
                        row["type"] not in filterType):
                    continue
                    
                lat = float(row["latitude"])
                lng = float(row["longitude"])
                time = datetime.strptime(
                        row["datetime"],
                            '%Y-%m-%d %H:%M:%S')
                desc = row["type"]
                street = row["street"]
                city = row["city"]
                dow = int(row["day_of_week"])
                dataset.append(
                            {'lat':lat,
                            'lng': lng,
                            'time':time,
                            'type':desc,
                            'street':street,
                            'city':city,
                            'dow':dow})


        self.dataset=dataset
        return dataset
    
    def initCollisionTypes(self):
        self.collision_types.add('1180-Trfc Collision-Major Inj')
        self.collision_types.add('1181-Trfc Collision-Minor Inj')
        self.collision_types.add('1182-Trfc Collision-No Inj')
        self.collision_types.add('1183-Trfc Collision-Unkn Inj')
        self.collision_types.add('1179-Trfc Collision-1141 Enrt')
        self.collision_types.add('20001-Hit and Run w/injuries')
        self.collision_types.add('20002-Hit and Run No injuries')
        self.collision_types.add('1144-Fatality')
    

    def countByStreet(self, dataset):
        intersection = {}
        for row in dataset:
            street = row["street"]
            if street not in intersection:
                intersection[street]={"count":0, "lat":0.0,'lng':0.0}
            intersection[street]["count"]+=1
            intersection[street]["lat"]+=row["lat"]
            intersection[street]["lng"]+=row["lng"]
            
        return [{"name":k, "count":v["count"],
            "lat":(v["lat"]/v["count"]),'lng':(v["lng"]/v["count"])} 
                for k,v in intersection.items()]
    
    def exportGeojson(self, wfile_name, data):
        stack=[]
        for row in data:
            if row["count"]<10: continue
            point = Point((row['lng'],row['lat']))
            properties ={'name':row["name"],
                    'count':row["count"]}
            stack.append(Feature(geometry=point,
                properties=properties))
    
        print(len(stack))
        stack = FeatureCollection(stack)
    
        with open(wfile_name+"2",'w') as wfile:
            dump(stack,wfile)

    def getDayPattern(self):
        highways =[] 
        with open("highways.json",'r') as rfile:
            highways = json.load(rfile)
        highways ={k:[0 for i in range(24)] for k in highways}
        for row in self.dataset:
            street=row['street'].upper()
            for highway in highways:
                if street.find(highway)>=0:
                    highways[highway][row['time'].hour]+=1
        # transform to d3 format (array)
        highways = [ {"name":name[:-1],
                    "category": ("I" if name[0]=="I" else "S"),
                    "counts":[ {"hour": ('%02d'%(i+1)), 'count':c} for i, c in enumerate(counts[1:]) ]
                    } for name, counts in highways.items() ]

        #leveled_highways={"InterState":[],"IntraState":[]}
        #for highway in highways:
        #    if highway["name"][0]== 'I':
        #        leveled_highways["InterState"].append(highway)
        #    else:
        #        leveled_highways["IntraState"].append(highway)
        return highways

    def getDangerRatio(self):
        Hit ={"name":"Hit","children":[{"name":"No-InJured","count":66383},
                {"name":"Unknow","count":48332},
                {"name":"Minor-Injured","count":28272+264},
                {"name":"Fatality","count":149}]}
        HitnRun={"name":"HitnRun","children":[{"name":"No-Injured","count":24841},
                {"name":"Injured","count":1422}]}
        Collision={"name":"Collision","children":[Hit,HitnRun]}
        Others={"name":"Others","children":[
            {"name": "WWD","title":"Wrong-Way-Driver", "count":1448},
            {"name": "OBFFV","title":"Object-Flying-From-Vehicle","count":1435},
            {"name": "DS","title":"Defective-Signal","count":1354}]}
        Human={"name":"Human","children":[Collision,Others]}
        Nature={"name":"Nature","children":[
            {"name":"Road-Kill","count":2434},
            {"name":"Fire","count":7417},
            {"name":"Flood","count":791},
            {"name":"Wind","count":179}]}
        All={"name":"All","children":[Human,Nature]}
        self.updateRatio(Hit)
        self.updateRatio(HitnRun)
        self.updateRatio(Collision)
        self.updateRatio(Others)
        self.updateRatio(Human)
        self.updateRatio(Nature)
        self.updateRatio(All)

        return All

    def updateRatio(self,data):
        count =0
        for child in data["children"]:
            count+=child["count"]
        data["count"]=count
        for child in data["children"]:
            child["ratio"]=round(child["count"]/count,3)
       
        shallow = [{"name":child["name"],
                    "count":child["count"],
                    "ratio":child["ratio"]} for child in data["children"] ]
        with open("dangerRatio/"+data["name"]+".json",'w') as wfile:
            json.dump(shallow,wfile)

        


    def getCollisionTypes(self):
        return self.collision_types

    



if __name__ == "__main__":
    rfile_name = "chp2017_edit.csv"
    prep = Preprocessor()
    #collision_type = prep.getCollisionTypes()
    #dataset = prep.readfile(rfile_name)

    #Dangers Ratio
    wfile_name = "dangerRatio/dangerRatioController.json"
    ratio=prep.getDangerRatio()
    with open(wfile_name, 'w') as wfile:
        json.dump(ratio,wfile, indent=4)


    # ---Get Freeway Names
    #wfile_name = "dayPattern.json"
    #dayPattern= prep.getDayPattern()
    #with open(wfile_name, 'w') as wfile:
    #    json.dump(dayPattern,wfile)


    # ---Get Geo-Counts---
    #wfile_name = 'dangerIntersection.geojson'
    #count_by_street=prep.countByStreet(dataset)
    #count_by_street.sort(key=lambda x: -1*x["count"])
    #plt.hist([ s["count"] for s in count_by_street if s["count"]>=20])
    #plt.show()
    #prep.exportGeojson(wfile_name,count_by_street)
    


