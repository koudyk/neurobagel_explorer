from pathlib import Path
import re

import pandas as pd


def remove_urls(df):
    urls = {
        "DatasetID": "http://neurobagel.org/vocab/",
        "SessionType": "http://neurobagel.org/vocab/",
        "Sex": "http://purl.bioontology.org/ontology/SNOMEDCT/",
        "Diagnosis": "http://purl.bioontology.org/ontology/SNOMEDCT/",
        "Assessment": "https://www.cognitiveatlas.org/task/id/",
        "Modality": "http://purl.org/nidash/nidm#",
    }
    for column, url in urls.items():
        try:
            df[column] = df[column].map(
                lambda x: x.replace(url, ""), na_action="ignore"
            )
        except TypeError:
            continue
    return df


# load data
file = Path(__file__).resolve().parent /"data" / "participant-level-results.tsv"
df = pd.read_csv(file, sep="\t")

for ind, row in df.iterrows():
    dataset_id = row["DatasetID"][len("http://neurobagel.org/vocab/"):]
    df.loc[ind, "ID"] = dataset_id + "_" + row["SubjectID"]
    
df = remove_urls(df)
df = df[df["Age"] != "protected"]  


df["Sex"] = df["Sex"].map(lambda x: x.replace("248152002", "F"), na_action="ignore")
df["Sex"] = df["Sex"].map(lambda x: x.replace("248153007", "M"), na_action="ignore")
df["Modality"] = df["Modality"].map(lambda x: re.sub(r"(\w)([A-Z])", r"\1 \2", x), na_action="ignore")


demographics, diagnosis, assessment, modality = [], [], [], []
for ID, group in df.groupby("ID"):
    try:
        age = int(float(group.dropna(subset="Age")["Age"].iloc[0]))
        sex = group.dropna(subset="Sex")["Sex"].iloc[0]
        demographics.append((ID, age, sex))
    
        try:
            items_str = group.dropna(subset="Diagnosis")["Diagnosis"].iloc[0]
            for item in items_str.split(", "):
                diagnosis.append((ID, item))
        except IndexError:
            pass
        
        try:
            items_str = group.dropna(subset="Assessment")["Assessment"].iloc[0]
            for item in items_str.split(", "):
                assessment.append((ID, item))
        except IndexError:
            pass
        
        try:
            items_str = group.dropna(subset="Modality")["Modality"].iloc[0]
            for item in items_str.split(", "):
                modality.append((ID, item))
        except IndexError:
            pass
        
    except IndexError:
        pass
    
    
demographics = pd.DataFrame(demographics, columns=["ID", "Age", "Sex"])
demographics = demographics.sort_values("Age")
demographics.to_csv(Path(__file__).resolve().parent / "data" / "demographics.csv", index=False)

diagnosis = pd.DataFrame(diagnosis, columns=["ID", "Diagnosis"])
diagnosis.to_csv(Path(__file__).resolve().parent / "data" / "diagnosis.csv", index=False)

assessment = pd.DataFrame(assessment, columns=["ID", "Assessment"])
assessment.to_csv(Path(__file__).resolve().parent / "data" / "assessment.csv", index=False)

modality = pd.DataFrame(modality, columns=["ID", "Modality"])
modality = modality.sort_values("Modality")
modality.to_csv(Path(__file__).resolve().parent / "data" / "modality.csv", index=False)
    
