Please extract the text data from the attached card images and output it as a CSV file. Use the visual layout of the cards (Action Card Anatomy) to identify the specific zones for extraction.

Map the data to the following specific CSV headers:

Initiative (Label B): The large number in the top-left corner.

Card Name (Label A): The title text at the very top of the card.

Tier (Label C): The value in the top-right corner cog/icon.

If it is a Roman Numeral (I, II, III, IV), output the numeral.

If it is the letter "H" (or a Helm/Wheel icon), output "H".

If there is no Roman Numeral or H (e.g., it is empty or "S"), output "Basic".

Color (Label D): The color of the vertical banner on the left side (e.g., Red, Green, Blue, Gold, Silver, Purple).

Defense (Label F - Shield): The number inside the Shield icon on the left banner.

Movement (Label F - Boot): The number inside the Boot icon on the left banner.

Attack (Label G): The large number located on the left side, sitting on the edge of the text box.

Action Type (Label L): The text inside the colored bar directly above the description box.

Range/Radius (Label M): The small number inside the circle or arrow icon attached to the right of the "Action Type" bar. If no number is present, leave blank.

Card Text (Label H): The body text inside the main description box. Preserve newlines and bullet points (wrap the text in double quotes).

Item Icon (Label K): Identify the small icon located just above the text box (usually on Tier II+ cards) and map it to the attribute it represents (do not describe the icon visually):

Boot icon -> output "Movement"

Hourglass/Sand Timer -> output "Initiative"

Circular Arrow/Target -> output "Radius"

Crossed Swords -> output "Attack"

Shield -> output "Defense"

If no icon is present, leave blank.

Formatting Rules:

Output only the CSV code block.

Use the exact headers listed above.

If a value is missing, leave the cell empty.

Title Case Enforcement: Ensure the Card Name and Action Type are formatted in Title Case (e.g., output "Battle Fury" instead of "BATTLE FURY", "Skill - Ranged" instead of "SKILL - RANGED").

For some Headers, only specific values are allowed (though they can be repeated). They are as follows:

Tier - I, II, III, IV, Basic, H

Movement, Attack, Initiative, Range/Radius, Defense - numerical values (they may have a + or something appended, such as Attack - 4+)

Item Icon - Movement, Attack, Initiative, Radius, Range, Defense

Color - Green, Gold, Blue, Red, Purple, Silver

Action Type is usually either Skill, Attack, or Ultimate, but there are some modifiers such as Basic Skill - Ranged or Basic Attack

There should also be an ID to identify each card in a set. Gold cards should be designated D (using the alternative Dorado as to not overlap with Green G) and can either be D or DH (if it's the handicap card). S for silver, P for purple.

Red, Green, and Blue cards have 1 tier I card each. Those should be R1, G1, B1, etc. the Tier II and III cards are for upgrading the tier I cards. They usually follow a pattern where one of the upgrades is just an improvement to the original tier I card, with better stats.

The other upgrade usually is also an improvement but has a different effect than the Tier I card. Those with different effects should be designated "B" such as R2B for the different effect version of the red tier II card. Strict upgrade cards should be designated A such as R2A

for the corresponding tier II red card.
