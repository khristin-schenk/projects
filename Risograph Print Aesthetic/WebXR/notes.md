 fully-immersive 3D experiences 
WebXR-compatible devices include fully-immersive 3D headsets with motion and orientation tracking, eyeglasses which overlay graphics atop the real world scene passing through the frames, and handheld mobile phones which augment reality by capturing the world with a camera and augment that scene with computer-generated imagery.
To accomplish these things, The WebXR Device API provides the following key capabilities:
Find compatible VR or AR output devices
Render a 3D scene to the device at an appropriate frame rate
(Optionally) mirror the output to a 2D display
Create vectors representing the movements of input controls
 
Movement, orientation, and motion
A typical XR device can have either 3 or 6 degrees of freedom and might or might not have an external positional sensor.
The equipment may also include an accelerometer, barometer, or other sensors which are used to sense when the user moves through space, rotates their head, or the like.
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
VR Accessibility Design: User Experience (UX) and User Interface (UI)
A person, regardless of their level of ability, should be able to meaningfully interact with and progress through the environment.


Accessibility issues that are currently excluding users:
Font style and size reading in VR in general can be a difficult experience especially for people experiencing challenges with vision or cognitive disabilities
How far away will your user typically be from a menu or heads up display (HUD)?
Would they be able to comfortably read the text if they move slightly further away?
Can people with lower vision increase the size of the text?
Does changing the font size break any of the UI layout, like text overflowing out of its box or getting cut off for the parts that don’t fit inside the box?

Visuals that flicker faster than once per second can cause epliptic seizures



Controller Mapping, Input, and Feedback

Provide option to select a dominant hand
Use haptic feedback for additional clarity
Add ray casts to simplify navigation and selection
Visually represent controller inputs with button highlights
Offer the option to personalize controller configurations
Minimize the complexity of your controller scheme
Minimize button press requirements
Be sure to consider hand tracking
Develop with voice input to further minimize user friction


Movement and locomotion


Locomotion: Moving the user from point A to point B to navigate within the virtual world
Movement: the finer-tuned movements of the user’s arms, head, and hands, and performing different actions required by gameplay
 
VR simulation sickness stems from a disruption to your proprioception-- what is happening in the virtual world (your character walking) is different from what is happening in the real world (your body sitting in a chair).




Consider the height and distance of objects in your environment, particularly objects that are important for the user to interact with in order to progress.
Seated users won’t be able to walk closer to a lever to pull it or step into a portal to go through it.
Can you go through the entire game sitting/standing in one place?
Are you able to look at, touch, or interact with all the objects you wanted to? If not, consider bringing objects closer to the user or giving the user a way to pull things closer to interact with or see more clearly without physical locomotion.
Physical locomotion is a great ability in VR but it shouldn’t be the sole method of locomotion.
Add options for controller-based locomotion
Joystick-based / Smooth locomotion
It often doesn’t even require people to lift their controller or point in a certain direction. This option 1) does not require people to physically move their body in order to move to a new location and 2) uses a minimal amount of input on the controller to execute the movement.


“Grab and Pull” locomotion


In this mode, people can “grab” the virtual world to move forward, backward, or sideways and rotate to face the desired direction. For those with limited mobility, this can give a stronger sense of agency in the application.


More options for controller-based movement

Some users may be able to use handheld controllers but have difficulty with maintaining their arms at a certain position or fully extending them. Developers can accommodate by allowing them to adjust the position of the virtual hand positions (e.g., changing the height/rotation of the virtual hands or their distance from the user’s body) and/or virtually support physical gestures by amplifying movement (e.g., virtual arm is fully outstretched even though the user’s physical arm is bent halfway). You can give users the option to customize parameters for each hand and set “hand profiles” to accommodate users who exhibit limited mobility in one arm or differing levels of mobility in each.





Resources:
Oculus for Developers
Matrix Math for the Web


