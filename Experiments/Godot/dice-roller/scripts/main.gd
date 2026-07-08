extends Node3D

@onready var dice = $Dice
@onready var label = $CanvasLayer/Label

func _ready():
	# Ensure Godot's random number generator is seeded differently every time
	randomize()
	if not dice.rolled.is_connected(_on_dice_rolled):
		dice.rolled.connect(_on_dice_rolled)
	var roll_button = $CanvasLayer/Button # Update this path if your button is named differently
	if not roll_button.pressed.is_connected(_on_button_pressed):
		roll_button.pressed.connect(_on_button_pressed)	

func _on_button_pressed():
	label.text = "Rolling..."
	dice.roll()

# This is triggered by the custom signal we made in the Dice script
func _on_dice_rolled(value: int):
	label.text = "You rolled a " + str(value) + "!"
