MPE Tester
==========

Test your MIDI Polyphonic Expression (MPE) configuration.

MPE Summary
-----------

- Wherever possible, **every sounding note is assigned its own MIDI Channel** for the lifetime of that note.
- By default, **Pitch Bend is set to of ±48 semitones** for per-note bend and ±2 semitones for Master bend. 
  Either range may be changed to a number of semitones between 0 and ±96 using RPN 0.
- **Aftertouch is sent using the Channel Pressure message**. To preserve compatibility with existing MIDI devices, Polyphonic Key Pressure 
  may be used with notes on the Master Channel, but not on other Channels.
- **A third dimension** of per-note control may be expressed using **MIDI CC #74**.  
- A Registered Parameter Number is used to set the range of Channels over which notes are sent and received.
  The MIDI Channel space can be divided into sub-spaces called **Zones**, so that multi-timbral playing is still possible using only one MIDI cable.
    - Each Zone has a dedicated extra Channel, called the Master Channel, which conveys information common to all notes in that Zone, including pedal data and overall Pitch Bend.
    - There are usually two zones. The Lower Zone is controlled by Master Channel 1, with Member Channels assigned sequentially from Channel 2 upwards. 
      The Upper Zone is controlled by Master Channel 16, with Member Channels assigned sequentially from Channel 15 downwards. 


Resources
---------

- [Official specifications](https://www.midi.org/downloads?task=callelement&format=raw&item_id=165&element=f85c494b-2b32-4109-b8c1-083cca2b7db6&method=download) 
- https://www.midi.org/articles-old/midi-polyphonic-expression-mpe
- http://www.rogerlinndesign.com/mpe.html
- https://roli.com/mpe
