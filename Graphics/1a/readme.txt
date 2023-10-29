'Claim' Section

T1: Camera position and 3D-shapes (20%)
>> 
using the example in the question, i generated 6 cubes and 3 cones. i picked the geometry of the cone off the 
internet and put it in a function called createCones. I then translated these objects away from each other in a 
3x3 matrix on the screen.

T2: Add user interaction to move world/camera (20%)
>>
i used the event listener to see if the arrow keys were pressed, and of they were i used a switch case to translate
the view matrix inverse to the camera movement. I move the scene left if the right key is pressed and vice versa.

T3: Add user interaction with the objects

a) selection (10%)
>> im saving the id of the selected object in a variable, and another function called createLocalAxes to draw these 
axis when the object is created. if the object is selected with the associated numbers, i display the local axis of 
the selection.

b) scaling (10%)
>>i created a function for scaling and it can be found in the Shape class. i use swicth case to take in the input 
and process the scaling operations. for the case where all objects are selected and worked on, i use a wrapper function and
pass values to it to do it without much redundancy.

c) rotations (10%)
>>even though i meant to include this in my wrapper class called localAllTransforms, i was running short on time so i let 
the redundacy be there and impleted the "all" case with for within the cases of switch.

d) translations (using arrow keys) (10%)
>>i created a function for scaling and it can be found in the Shape class. i use swicth case to take in the input 
and process the scaling operations. for the case where all objects are selected and worked on, i use a wrapper function and
pass values to it to do it without much redundancy.


T4: Use 3D-models (20%)

Import and use 3D models in addition to the basic 3D shapes. For example, these models. In order to correctly parse and use these models you will have to learn about the OBJ file format. Please note: Without proper lighting, the results will appear flat. This is ok for this step though, lighting will be applied in the next part of the lab.



'Tested environments' Section