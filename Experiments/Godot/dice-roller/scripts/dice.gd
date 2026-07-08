extends RigidBody3D

signal rolled(value: int)

@onready var faces = $d20/Faces

func _ready():
	# Connect the signal that triggers when the rigid body stops moving
	sleeping_state_changed.connect(_on_sleeping_state_changed)

func roll():
	# Wake the physics body up and reset its drop position
	sleeping = false
	global_position = Vector3(0, 5, 0) # Drops the dice from 5 units high
	
	# Randomize the starting rotation
	global_rotation = Vector3(randf_range(0, TAU), randf_range(0, TAU), randf_range(0, TAU))
	
	# Kill any leftover momentum from previous rolls
	linear_velocity = Vector3.ZERO
	angular_velocity = Vector3.ZERO
	
	# Generate random throw force and spin
	var throw_impulse = Vector3(randf_range(-3, 3), randf_range(3, 8), randf_range(-3, 3))
	var spin_impulse = Vector3(randf_range(-15, 15), randf_range(-15, 15), randf_range(-15, 15))
	
	# Apply the physics
	apply_central_impulse(throw_impulse)
	apply_torque_impulse(spin_impulse)

func _on_sleeping_state_changed():
	# When the rigid body enters sleep mode (stops moving), read the result
	if sleeping:
		call_deferred("determine_face")

func determine_face():
	var highest_face: Node3D = null
	var max_y = -INF
	
	# Loop through all 20 markers. 
	# The one with the highest global Y position is pointing straight up.
	for face in faces.get_children():
		if face.global_position.y > max_y:
			max_y = face.global_position.y
			highest_face = face
			
	if highest_face:
		# Extract the number from the marker's name (e.g., "Face_20" -> 20)
		var result_string = highest_face.name.trim_prefix("Face_")
		var result = result_string.to_int()
		print("The dice calculated a roll of: ", result)
		rolled.emit(result)
