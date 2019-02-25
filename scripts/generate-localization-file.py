#!/usr/bin/python
import argparse, sys
import os
import json
import csv

parser = argparse.ArgumentParser()
parser.add_argument('--language', help='Language', required=True)
args = parser.parse_args()

lang = args.language
path = "../src/i18n/" + lang


def walk(root, node, filename, csvwriter):
    for name, value in node.items():
        name = name.replace(".", "$dot$")
        if root:
            key = root + "." + name
        else:
            key = name
        if type(value) is dict:
            walk(key, value, filename, csvwriter)
        else:
            # print key + " : " + value
            csvwriter.writerow([key, value.encode("utf-8"), filename])


with open(lang + ".csv", 'w') as csvfile:
    csvwriter = csv.writer(csvfile, delimiter='|')
    # generate file with translations

    for root, dirs, files in os.walk(path):
        for filename in files:
            # filename = "form-playground.json"
            filePath = path + "/" + filename
            print "Process file " + filePath

            # parce json file
            content = open(filePath, "r").read()
            json_data = json.loads(content)

            walk("", json_data, filename, csvwriter)
