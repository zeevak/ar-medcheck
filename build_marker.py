import os
from PIL import Image

def generate_custom_marker(input_img_path, output_patt_path, output_marker_img_path):
    # 1. Open input image
    raw_img = Image.open(input_img_path).convert('RGB')
    w, h = raw_img.size
    
    # Center crop to square
    min_dim = min(w, h)
    left = (w - min_dim) // 2
    top = (h - min_dim) // 2
    square_img = raw_img.crop((left, top, left + min_dim, top + min_dim))
    
    # Inner image for marker pattern: 512x512
    inner_512 = square_img.resize((512, 512), Image.Resampling.LANCZOS)
    
    # 2. Generate .patt string
    # AR.js resizes inner image to 16x16
    img_16 = inner_512.resize((16, 16), Image.Resampling.BILINEAR)
    
    # 4 orientations: 0, 90, 180, 270 (matching THREEx.ArPatternFile.encodeImage)
    orientations = [0, 90, 180, 270]
    patt_parts = []
    
    for ori in orientations:
        rot_img = img_16.rotate(ori) if ori != 0 else img_16
        rot_rgb = rot_img.convert('RGB')
        
        lines = []
        # BGR order: Blue (2), Green (1), Red (0)
        for channel in [2, 1, 0]:
            for y in range(16):
                row_vals = []
                for x in range(16):
                    pixel = rot_rgb.getpixel((x, y))
                    val = pixel[channel]
                    row_vals.append(f"{val:>3}")
                lines.append(" ".join(row_vals))
        
        patt_parts.append("\n".join(lines))
    
    pattern_string = "\n\n".join(patt_parts) + "\n"
    
    with open(output_patt_path, 'w', encoding='utf-8') as f:
        f.write(pattern_string)
    
    print(f"Generated {output_patt_path} ({len(pattern_string)} bytes, {len(pattern_string.splitlines())} lines)")
    
    # 3. Generate full marker image (white quiet zone + black square border + inner image)
    # Standard AR.js 512x512 or 1000x1000 marker
    marker_size = 1000
    white_margin = 0.10 # 10%
    # innerMargin = whiteMargin + (1 - 2*whiteMargin) * ((1 - pattRatio)/2)
    # pattRatio = 0.50 -> innerMargin = 0.10 + 0.80 * 0.25 = 0.30 (30%)
    inner_margin = 0.25 # Clean 50% image ratio inside black border
    
    marker_canvas = Image.new('RGB', (marker_size, marker_size), (255, 255, 255))
    
    # Draw black square
    from PIL import ImageDraw
    draw = ImageDraw.Draw(marker_canvas)
    bm_left = int(white_margin * marker_size)
    bm_top = int(white_margin * marker_size)
    bm_right = int((1 - white_margin) * marker_size)
    bm_bottom = int((1 - white_margin) * marker_size)
    draw.rectangle([bm_left, bm_top, bm_right, bm_bottom], fill=(0, 0, 0))
    
    # Paste inner image
    im_left = int(inner_margin * marker_size)
    im_top = int(inner_margin * marker_size)
    im_size = int((1 - 2 * inner_margin) * marker_size)
    
    resized_inner = square_img.resize((im_size, im_size), Image.Resampling.LANCZOS)
    marker_canvas.paste(resized_inner, (im_left, im_top))
    
    marker_canvas.save(output_marker_img_path, quality=95)
    print(f"Generated {output_marker_img_path} ({os.path.getsize(output_marker_img_path)} bytes)")

if __name__ == '__main__':
    generate_custom_marker('assets/markerBG.jpg', 'assets/pattern-marker.patt', 'assets/custom-marker.png')
