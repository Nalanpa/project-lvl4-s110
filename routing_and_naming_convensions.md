## I adhere to following RoR-like naming convention

For *'Entity'*

Verb | Route | Route Name | View (.pug)
-----|-------|------------|-----
GET  | /entities | entitiesIndex | entities/index
POST | /entities | entitiesCreate |
GET  | /entities/new | entitiesNew | entities/new
GET  | /entities/:id/edit | entitiesEdit | /entities/edit
GET  | /entities/:id/ | entitiesShow | /entities/show
PUT or PATCH | /entities/:id/ | entitiesUpdate |
DELETE | /entities/:id/ | entitiesDelete |
