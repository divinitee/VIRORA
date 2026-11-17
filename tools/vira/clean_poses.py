"""Vira pose cleanup (2026-11-17): white sticker fringe + cut-off fragments.
usage: python3 vira_clean.py <in_dir> <out_dir>   (mirrors <mood>/<file>.webp)
"""
import sys, os, glob, json
import numpy as np
from PIL import Image
from scipy import ndimage

src, dst = sys.argv[1], sys.argv[2]
report = {}
for f in sorted(glob.glob(os.path.join(src, '*', '*.webp'))):
    im = Image.open(f).convert('RGBA')
    a = np.array(im)
    H, W = a.shape[:2]
    alpha = a[..., 3]
    mask = alpha > 40
    lab, n = ndimage.label(mask, structure=np.ones((3, 3)))
    sizes = ndimage.sum(mask, lab, range(1, n + 1)) if n else np.array([])
    main = int(np.argmax(sizes)) + 1 if n else 0
    removed = []
    for i in range(1, n + 1):
        if i == main:
            continue
        ys, xs = np.where(lab == i)
        sz = int(sizes[i - 1])
        touches = xs.min() == 0 or ys.min() == 0 or xs.max() == W - 1 or ys.max() == H - 1
        low_small = ys.min() > 0.85 * H and sz < 200
        speck = sz < 12
        rgbv = a[ys, xs, :3].astype(int)
        yellow = ((rgbv[:, 0] > 200) & (rgbv[:, 1] > 170) & (rgbv[:, 2] < 120)).mean()
        effect_mark = yellow > 0.3  # the yellow emphasis marks are part of the art: keep them
        if (touches and not effect_mark) or low_small or speck:
            removed.append(sz)
            a[lab == i, 3] = 0
    # faint dust outside every kept component
    keep = ndimage.binary_dilation(a[..., 3] > 40, iterations=2)
    dust = (a[..., 3] > 0) & ~keep
    a[dust, 3] = 0
    # defringe: peel near-white, low-saturation pixels touching the outside, up to 4 px deep
    rgb = a[..., :3].astype(int)
    whiteish = (rgb.min(axis=2) > 195) & ((rgb.max(axis=2) - rgb.min(axis=2)) < 45)
    peeled = 0
    for _ in range(4):
        solid = a[..., 3] > 0
        outside = ~solid
        outside_lab, _n = ndimage.label(outside)
        # only the outer transparent region(s) touching the border count as "outside"
        border_ids = set(np.unique(np.concatenate([outside_lab[0], outside_lab[-1], outside_lab[:, 0], outside_lab[:, -1]]))) - {0}
        ext = np.isin(outside_lab, list(border_ids))
        rim = solid & ndimage.binary_dilation(ext, structure=np.ones((3, 3)))
        kill = rim & whiteish
        k = int(kill.sum())
        if not k:
            break
        a[kill, 3] = 0
        peeled += k
    # soften the new edge by one px: semi-transparent bright rim pixels get faded
    os.makedirs(os.path.join(dst, os.path.basename(os.path.dirname(f))), exist_ok=True)
    out = os.path.join(dst, os.path.basename(os.path.dirname(f)), os.path.basename(f))
    Image.fromarray(a).save(out, 'WEBP', quality=88, method=4)
    report[os.path.basename(f)] = {'removed_fragments': removed, 'peeled_px': peeled, 'dust_px': int(dust.sum())}
print(json.dumps({k: v for k, v in report.items() if v['removed_fragments'] or v['peeled_px'] > 100}, indent=0))
