
# Star Ocean Anamnesis Nox Data Extraction

## Tools Used

* Node.js
* GraphicsMagick
* PVRTexToolCLI.exe (included in repo) but for manual work, you can use PVRTexTool or Mali Texture Compression Tool
* SOADec.exe (included in repo)
* SOAImgEx.exe (included in repo) 

## Setup

* `npm i`
* if you want to use image modify features (resize, trim) you will need GraphicsMagick

### Get This Module on NPM

You can also find this package on npm as `soa-extract`: `npm i -g soa-extract`.

## Preparation / Get Files

1. After downloading Star Ocean: Anamnesis, log on, and start the tutorial (you do not need to finish it).
2. Open the Nox file explorer, and navigate to `/data/data/com.square_enix.android.android_googleplay.StarOceann\files\download\Image`.
3. Copy the `etc2` folder to `/mnt/shared/OtherShare` (which will make it available to your file system in your `~/Nox_Share/Other`)

## Automatically Ripping Images

It is now possible to automatically rip the files after doing the above steps manually. The CLI is flexible and offers some additional features beyond ripping, as well.

For doing this, you should specify a path to the folder with the `.aif` files.

### CLI Arguments

* `--soa-dec-location` - the path to SOADec.exe (defaults to `./bin/SOADec.exe`)
* `--soa-imgex-location` - the path to SOAImgEx.exe (defaults to `./bin/SOAImgEx.exe`)
* `--pvr-textool-location` - the path to PVRTexToolCLI.exe (defaults to `./bin/PVRTexToolCLI.exe`)
* `--output-folder` - the path to the desired folder output (defaults to `./output`)
* `--input-folder` - the path to the desired input (defaults to `./input`)
* `--error-log` - the path to the error log file (defaults to `./error.log`)
* `--filter` - filter by files that start with the given text (defaults to `''` (no filter));
* `--trim` - use GraphicsMagick to trim the output images to their borders, usually to resize them to a uniform size
* `--resize WxH!` - use GraphicsMagick to resize the output images to the specified size, in the WidthxHeight format (for example, 256x256). To force resize in all circumstances, append a ! (for example, 256x256!). You probably will want to use `--filter` if you're using this.
* `--compress` - compress the output images using pngquant. It will run default compression. To pass args to pngquant, do `--compress="--quality 50-60"`. A full listing of pngquant args can be found [on their website](https://pngquant.org/).
* `--diff-only` - do _only_ a diff and no processing. For this, you still need to specify `--output-folder`.
* `--diff` - the path of the folder to compare against to see new / old files
* `--diff-log` - the path to the diff log file (defaults to `./diff.log`)

#### CLI Examples

* Normal extraction: `soa-extract --input-folder=etc2 --output-folder=extract --compress`
* Normal extraction w/ diff: `soa-extract --input-folder=etc2 --output-folder=extract2 --compress --diff=extract`
* Extract item sprites, resize, and compress highly: `soa-extract --input-folder=etc2 --output-folder=extract --trim --resize 128x128! --compress="--quality=50-60" --filter=itm_th_`
* Diff two folders: `soa-extract --diff-only --output-folder=extract2 --diff=extract`
* Extract stamps: `soa-extract --input-folder=etc2 --output-folder=extract --trim --filter=stp_`

## Manually Ripping Images

**Note: This can be done without setting up or installing Node.js**

1. Drag the `etc2` folder on top of `SOADec.exe` - this should produce a lot of files with `_unpack` in the name, at the end.
      - If desired, you can remove all the other files with `find -type f \! -name '*_unpack*' -delete` or equivalent
2. Drag any `.aif` file onto `SOAImgEx.exe`. 
      - This will create a `Textures` folder with all of the textures for this particular sprite. This can be opened in Mali Texture Compression Tool or PVRTexTool.
      - Doing multiple files at a time _will not work_ because `SOAImgEx` does not support specific file name output. Ideally, automating this will address this issue as these files can be post-processed.
3. Open or move the image in a different tool and save it as PNG.
4. Repeat ad infintum until you want to gouge your eyes out.
5. Done.

## File Information

All the cool shit is in `Images/etc2`. Known translations:

- `banner_` - All banners.
- `battle_*` - Battle status icons.
- `cp0*` - Portrait, compressed portrait, and character sprites.
- `cn0*` - Portrait, compressed portrait, and character sprites (again?)
- `cm0*` - Portrait, compressed portrait, and character sprites (again?)
- `cc0*` - Portrait, compressed portrait, and character sprites (again?)
- `ElementIcon_*` - Element icons.
- `EnemyIcon_*` - Enemy type icons.
- `enm_th_*` - Enemy sprites.
- `icon_boss*` - Misery boss icons.
- `ItemIcon_weapon_*` - Weapon type icons.
- `itm_th_*` - Item sprites. Different ranges have different sprites.
- `pickup_img_*` - Gacha boxes.
- `planet*` - Planet images.
- `plate_honor_*` - Title plate sprites.
- `rare*` - Star rarity icons.
- `Role_*` - Role icons.
- `rsh_*` - Skill rush sprites.
- `rsh_Magic_*` - Magic rush sprites.
- `skl_*` - Skill sprites.
- `stp_*` - Stamp sprites.
- `ticketgacha_*` - Gacha tickets.
- `tips_th_*` - The screen transition tips.
- `ui_th_*` - Deep space icons.

# Credits

Major credit to akderebur from Xentax forums [thread](http://forum.xentax.com/viewtopic.php?f=16&t=18692) for SOADec and SOAImageEx. I'm just aggregating this information. If you want to find the original versions of the files in this repo, you can get them from that thread.
