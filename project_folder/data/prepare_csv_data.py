from pathlib import Path

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
file = Path(__file__).resolve().parent / "participant-level-results.tsv"
df = pd.read_csv(file, sep="\t")
df = df.iloc[0:1000]

for ind, row in df.iterrows():
    dataset_id = row["DatasetID"][len("http://neurobagel.org/vocab/"):]
    df.loc[ind, "ID"] = dataset_id + "_" + row["SubjectID"]
    
df = remove_urls(df)   


df["Sex"] = df["Sex"].map(lambda x: x.replace("248152002", "F"), na_action="ignore")
df["Sex"] = df["Sex"].map(lambda x: x.replace("248153007", "M"), na_action="ignore")

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
demographics.to_csv("temp.csv", index=False)
    
