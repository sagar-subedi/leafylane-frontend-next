from PIL import Image

# constants
passport_width_cm = 3.5
passport_height_cm = 4.5
dpi = 300  # print quality
a4_width_cm, a4_height_cm = 21.0, 29.7

# convert cm to pixels
def cm_to_px(cm): return int((cm / 2.54) * dpi)

passport_w, passport_h = cm_to_px(passport_width_cm), cm_to_px(passport_height_cm)
a4_w, a4_h = cm_to_px(a4_width_cm), cm_to_px(a4_height_cm)

# open the passport photo
photo = Image.open("passport.jpeg").resize((passport_w, passport_h))

# create blank A4 white background
a4 = Image.new("RGB", (a4_w, a4_h), "white")

# calculate grid layout
cols = a4_w // (passport_w + 30)  # with small gap
rows = a4_h // (passport_h + 30)

x_offset = 15
y_offset = 15

for row in range(rows):
    for col in range(cols):
        x = x_offset + col * (passport_w + 30)
        y = y_offset + row * (passport_h + 30)
        a4.paste(photo, (x, y))

a4.save("passport_sheet.jpg")
print("✅ Generated passport photo sheet: passport_sheet.jpg")
