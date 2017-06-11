# Business-rules
---

1. Only author can delete a _Task_
2. Only __"New"__ _Task_ can be deleted
3. Author can assign and reassign his _Task_ to anybody
4. Anybody can take (assign to himself) a __"New"__ _Task_
5. Author can change _Status_ of his _Task_
6. Workflow (_Status_ changing):
  * New -> __Processing__ || __Testing__
  * __Processing__ -> __Testing__ || __Done__
  * __Testing__ -> __Processing__ || __Done__
  * __Done__ ->|
7. Worker (who have assigned __"Processing"__ _Task_ to him) can change status to __"Testing"__   
6. Tester (who have assigned __"Testing"__ _Task_ to him) can change status to __"Processing"__    
6. Only author can change _Status_ to __"Done"__
7. _Tags_ can be assigned to _Task_ only by author or person who have assigned this _Task_ to him
