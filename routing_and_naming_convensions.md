## I've tried to adhere to following RoR-like naming convention

For *'Entity'*

Verb | Route | Route Name | View (.pug)
-----|-------|------------|-----
GET  | /entities | entitiesIndex | entities/index
POST | /entities | entitiesCreate |
GET  | /entities/new | entitiesNew | entities/new
GET  | /entities/:id/edit | entitiesEdit... | /entities/edit_ ...
GET  | /entities/:id/ | entitiesShow | /entities/show
PUT or PUTCH | /entities/:id/ | entitiesUpdate |
DELETE | /entities/:id/ | entitiesDelete |


If there are multiply forms for editing, data routes are following:

*/entities/:id/edit/form1, /entities/:id/edit/form2* etc.
*entitiesEditFor1, entitiesEditForm2* etc.


and views:

*/entities/edit_form1, /entities/edit_form2*  etc.
