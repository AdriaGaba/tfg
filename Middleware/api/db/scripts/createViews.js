const {poolConfig} = require('../connect');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg/lib');

const createViewActiveProjects = async () => {
    const client = new Pool(poolConfig);
    const query = `CREATE VIEW Projectes_Actius AS
                   SELECT s.p,s.d,a.pg,s.e
                   FROM public.start_project s
                   LEFT JOIN public.assign_project a
                   ON (s.p = a.p)
                   WHERE ((NOT EXISTS(
                   		SELECT *
                   		FROM public.end_project e
                   		WHERE s.p = e.p))
                   	AND (s.timestamp <
                   		(SELECT extract(epoch from now())) and
                   		s.e >
                   		(SELECT extract(epoch from now())))
                      );`

    client.connect();
    await client.query(query);
    client.end();
    console.log("Creant vista tots els projectes actius");
};

const createViewAssignedActiveProjects = async () => {
    const client = new Pool(poolConfig);
    const query = `CREATE VIEW Projectes_Assignats AS
                   SELECT s.p,s.d,a.pg,s.e
                   FROM public.start_project s
                   INNER JOIN public.assign_project a
                   ON (s.p = a.p)
                   	AND((NOT EXISTS(
                   			SELECT *
                   			FROM public.end_project e
                   			WHERE s.p = e.p))
                   		AND (s.timestamp <
                   	   		(SELECT extract(epoch from now())) and
                   	   		s.e >
                   	  		(SELECT extract(epoch from now())))
                   	   );`

    client.connect();
    await client.query(query);
    client.end();
    console.log("Creant vista projectes que estan sent executats");
};

const createViewPendingProjects = async () => {
    const client = new Pool(poolConfig);
    const query = `CREATE VIEW Projectes_Pendents AS
                   SELECT s.p,s.d,s.e
                   FROM public.start_project s
                   WHERE ((NOT EXISTS(
                   	SELECT *
                   	FROM public.end_project e
                   	WHERE s.p = e.p))
                   AND (NOT EXISTS(
                   	SELECT *
                   	FROM public.assign_project a
                   	WHERE s.p = a.p))
                   AND (s.timestamp <
                   	(SELECT extract(epoch from now())) and
                   	s.e >
                   	(SELECT extract(epoch from now())))
                   );`

    client.connect();
    await client.query(query);
    client.end();
    console.log("Creant vista projectes pendents de ser assignats");
};

const createViewCriticalProjects = async () => { //Projecte crític = quan instant de finalització és en menys de 3 dies
    const client = new Pool(poolConfig);
    const query = `CREATE VIEW Projectes_Critics AS
                   SELECT *
                   FROM projectes_actius v
                   WHERE (SELECT extract(epoch from now())) >= v.e - 259200;`

    client.connect();
    await client.query(query);
    client.end();
    console.log("Creant vista projectes crítics");
};

const createViewActiveDepartments = async () => {
    const client = new Pool(poolConfig);
    const query = `CREATE VIEW Departaments_actius AS
                   SELECT cr.nomdpt, cr.descripciodpt, cr.oficinadpt
                   FROM public.create_dpt cr
                   WHERE (NOT EXISTS( SELECT *
                   	  FROM public.close_dpt cl
                   	  WHERE cr.nomdpt = cl.nomdpt));`

    client.connect();
    await client.query(query);
    client.end();
    console.log("Creant vista departaments actius");
};

const createViewClosedDepartments = async () => {
    const client = new Pool(poolConfig);
    const query = `CREATE VIEW Departaments_tancats AS
                   SELECT cr.nomdpt, cr.descripciodpt, cr.oficinadpt
                   FROM public.create_dpt cr
                   WHERE (EXISTS( SELECT *
                   	  FROM public.close_dpt cl
                   	  WHERE cr.nomdpt = cl.nomdpt));`

    client.connect();
    await client.query(query);
    client.end();
    console.log("Creant vista departaments tancats");
};

const createAllViews = async () => {
    await createViewActiveProjects();
    await createViewAssignedActiveProjects();
    await createViewCriticalProjects();
    await createViewPendingProjects();
    await createViewActiveDepartments();
    await createViewClosedDepartments();
}

module.exports = {
  createAllViews
};