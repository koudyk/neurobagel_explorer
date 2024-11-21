import * as d3 from 'https://cdn.skypack.dev/d3@7';

async function fetch(file) {
    return await d3.csv(file, d3.autoType);
}

function prepare(dataset, field) {
    const groups = d3.groups(dataset, d => d[field]);

    console.log(`Groups for ${field}: `, groups);

    return groups.map(g => ({[field.toLowerCase()]: g[0], count: g[1].length}));
}

export async function getData(file, field) {
    const dataset = await fetch(file);
    return prepare(dataset, field);
}