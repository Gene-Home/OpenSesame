import csv
from json import JSONEncoder;
try:
   from simplejson import dumps as json_dumps;
except Exception,e:
   from json import dumps as json_dumps;

from sys import argv;

if(len(argv)<3):
   raise Exception("Need two arguments: input filename and output filename");

data = open(argv[1])
reader = csv.DictReader(data, delimiter="\t", quotechar='"')
list_out=[]
f = open(argv[2],"w");
for r in reader:
   row_obj={};
   for k,v in r.items():
      
      if 'q' in k:
         v = float(v)
      if 'p' in k:
         v = float(v)
      row_obj[k]=v;
   list_out.append(row_obj);
data.close();

f.write(json_dumps(list_out,indent=4))
f.close();
