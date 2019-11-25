function createTable() {
    d3.csv('beca_activities.csv', data => {
        const thead_tr = d3.select('thead').append('tr');
        const column_names = Object.keys(data[0]);
        column_names.forEach(name => {
            thead_tr.append('th').text(name);
        });
    
        const tbody = d3.select("tbody");    
    
        data.forEach(activity =>{
            const tr = tbody.append("tr");
            Object.entries(activity).forEach(([key, value]) => {
                tr.append("td").text(value);
            });
        });
    });
};

createTable();