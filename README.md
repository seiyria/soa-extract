
# Star Ocean Anamnesis Nox Data Extraction

## Tools Used

* PVRTexTool or Mali Texture Compression Tool
* SOADec.exe (included in repo)
* SOAImgEx.exe (included in repo) 

## Preparation / Get Files

1. After downloading Star Ocean: Anamnesis, log on, and start the tutorial (you do not need to finish it).
2. Open the Nox file explorer, and navigate to `/data/data/com.square_enix.android.android_googleplay.StarOceann\files\download\Image`.
3. Copy the `etc2` folder to `/mnt/shared/OtherShare` (which will make it available to your file system in your `~/Nox_Share/Other)
4. Drag the `etc2` folder on top of `SOADec.exe` - this should produce a lot of files with `_unpack` in the name, at the end.
  - If desired, you can remove all the other files with `find -type f \! -name '*_unpack*' -delete` or equivalent
5. Drag any `.aif` file onto `SOAImgEx.exe`. 
  - This will create a `Textures` folder with all of the textures for this particular sprite. This can be opened in Mali Texture Compression Tool or PVRTexTool.
  - Doing multiple files at a time _will not work_ because `SOAImgEx` does not support specific file name output. Ideally, automating this will address this issue as these files can be post-processed.
6. Open or move the image in a different tool and save it as PNG.
7. Repeat ad infintum until you want to gouge your eyes out.
8. Done.

## File Information

All the cool shit is in `Images/etc2`. Known translations:

- `skl_*` - Skill sprites.
- `rsh_Magic_*` - Magic sprites.
- `Role_*` - Role icons.
- `itm_th_*` - Item sprites. Different ranges have different sprites.
- `ItemIcon_weapon_*` - Weapon type icons.
- `enm_th_*` - Enemy sprites.
- `EnemyIcon_*` - Enemy type icons.
- `ElementIcon_*` - Element icons.
- `cp0*` - Portrait, compressed portrait, and character sprites.
- `cn0*` - Portrait, compressed portrait, and character sprites (again?)
- `cm0*` - Portrait, compressed portrait, and character sprites (again?)
- `cc0*` - Portrait, compressed portrait, and character sprites (again?)
- `banner_` - All banners.
- `battle_*` - Battle status icons.
- `icon_boss*` - Misery boss icons.
- `plate_honor_*` - Title plate sprites.
- `rare*` - Star rarity icons.

# Credits

Major credit to akderebur from Xentax forums [thread](http://forum.xentax.com/viewtopic.php?f=16&t=18692) for SOADec and SOAImageEx. I'm just aggregating this information. If you want to find the original versions of the files in this repo, you can get them from that thread.

# TODO

* Automate this with a script, because it's super tedious.
  * It is unknown if it is possible to get the data directly from Nox without first moving the files manually.
  * SOAImgEx needs pre/post-processing to get the file(s) in/out synchronously.
  * PVRTexTool seems to support decompressing via CLI, but untested.