# Business-rules
---

1. Only author can delete a _Task_
2. Only _"New" Task_ can be deleted
3. Author can assign and reassign his _Task_ to anybody
4. Anybody can take (assign to himself) a _"New" Task_
5. Author can change _Status_ of his _Task_
5. Workflow (_Status_ changing):
  * New -> Processing || Testing
  * Processing -> Testing || Done
  * Testing -> Processing || Done
  * Done ->|
6. Worker (who have assigned _"Processing" Task_ to him) can change status to _"Testing"_   
6. Tester (who have assigned _"Testing" Task_ to him) can change status to _"Processing"_    
6. Only author can change _Status_ to _"Done"_
7. _Tags_ can be assigned to _Task_ only by author or person who have assigned this _Task_ to him 
