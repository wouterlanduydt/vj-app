# VJ app

For our final web programming course we had to create a web based application that combined one of the technologies we saw in class and one technology we had to experiment with ourself.

We chose to combine Web MIDI, Web Audio and three.js into one killer visual jockey app. You can check out the project [here](https://vj-app-b96f2.firebaseapp.com/) (you'll need to connect a Traktor Kontrol F1 to experiment with the visuals.)

As an extra we collect sound via the mic and visuals through a webcam to manipulate the visuals even further.

## Requirements

Traktor Kontrol F1 (you might also need "controller editor" from Native Instruments website to activate MIDI mode on this device if it doesn't work after plugging in and pressing SHIFT+BROWSE).

For now, Web MIDI is only available in Opera and Chrome.

## Mapping

As a MIDI device we chose the Traktor Kontrol F1. This because it has many buttons and is well known in the DJ scene which is a plus.

**PUNCH-1**: scene 1 (cubes)
**PUNCH-2**: scene 2 (balls)
**PUNCH-3**: scene 3 (vertices)

**FILTER-1**: shape color red
**FILTER-2**: shape color green
**FILTER-3**: shape color blue
**FILTER-4**: beat sensitivity

**SLIDER-1**: shape x-rotation speed
**SLIDER-2**: shape y-rotation speed
**SLIDER-3**: shape z-rotation speed

**KEYLOCK-1**: shape material default
**KEYLOCK-2**: shape material standard (shiney)
**KEYLOCK-3**: shape material wireframe

**FX-1**: one shot effect strobe
**FX-2**: one shot effect fade-out
**FX-3**: one shot effect disco

**SHIFT+FILTER-1**: background color red
**SHIFT+FILTER-2**: background color green
**SHIFT+FILTER-3**: background color blue
**SHIFT+FILTER-4**: backround y-rotation speed

**SHIFT+KEYLOCK-1**: background material solid
**SHIFT+KEYLOCK-2**: background material video
**SHIFT+KEYLOCK-3**: background material wireframe
