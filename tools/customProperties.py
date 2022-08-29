
# Loaded from script tab in Blender


bl_info = {
    "name": "customPropertiesRock on selection",
}


import bpy

objs = bpy.context.selected_objects

for obj in objs:
    obj["mass"] = 0
    obj["objectType"] = "prop"




///////////////////////////////////////////////////////////


bl_info = {
    "name": "customPropertiesGround on selection",
}


import bpy

objs = bpy.context.selected_objects

for obj in objs:
    obj["mass"] = 0
    obj["objectType"] = "ground"


///////////////////////////////////////////////////////////


bl_info = {
    "name": "customPropertiesCoin on selection",
}


import bpy

objs = bpy.context.selected_objects

for obj in objs:
    obj["mass"] = 0
    obj["objectType"] = "coin"


///////////////////////////////////////////////////////////


bl_info = {
    "name": "customPropertiesFoliage on selection",
}


import bpy

objs = bpy.context.selected_objects

for obj in objs:
    obj["mass"] = 0
    obj["objectType"] = "foliage"


///////////////////////////////////////////////////////////


bl_info = {
    "name": "customPropertiesPortfolio on selection",
}


import bpy

objs = bpy.context.selected_objects

for obj in objs:
    obj["mass"] = 0
    obj["objectType"] = "portfolio"

