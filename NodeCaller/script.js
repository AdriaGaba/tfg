const activeProjects = document.getElementById("ActiveProjects");
activeProjects.addEventListener("submit", (event) => {
    event.preventDefault();
    let projectDate = document.getElementById("projectDate").value;
    let projectDateJson = JSON.stringify(projectDate);
    console.log(projectDateJson);
    //Mandar datos al backend
    fetch('http://localhost:3001/activeProjects', {
        method: 'Post',
        body: projectDate
        })
    });