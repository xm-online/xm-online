#!/usr/bin/python
import argparse, sys
import json
import csv
import codecs

parser = argparse.ArgumentParser()
parser.add_argument('--language', help='Language', required=True)
parser.add_argument('--file', help='Localized file', required=True)
args = parser.parse_args()

file = args.file
lang = args.language
path = "../src/i18n/" + lang

jsonFileDict = {}


def put_to_json(json, keys_arr, value):
    key = keys_arr.pop()
    key = key.replace("$dot$", ".")

    if keys_arr:
        if key not in json:
            json[key] = {}

        put_to_json(json[key], keys_arr, value)
    else:
        json[key] = value


# 0 - key
# 1 - translation
# 2 - localization file
# Process csv file
with open(file) as csvfile:
    csvreader = csv.reader(csvfile, delimiter='|')
    for row in csvreader:
        jsonFile = row[2]

        if jsonFile not in jsonFileDict:
            jsonFileDict[jsonFile] = {}

        # get reversed array of keys
        keys = row[0].split(".")
        keys.reverse()

        # recursive search in json
        put_to_json(jsonFileDict[jsonFile], keys, row[1])

print "Found files: " + str(jsonFileDict.keys())

# Generate localization files
for jsonFile, jsonContent in jsonFileDict.items():
    with codecs.open(path + "/" + jsonFile, "w") as f:
        f.write(json.dumps(jsonContent, indent=4, ensure_ascii=False))
