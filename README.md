<a name="readme-top"></a>
The raw folder (and the zip) contain the code. Feel free to look at and modify it.

<!-- TABLE OF CONTENTS -->
<ol>
   <li><a href="#features">Features</a></li>
   <li>
   <a href="#installation">Installation</a>
   <ul>
      <li><a href="#from-crx">From crx</a></li>
      <li><a href="#from-zip">From zip</a></li>
   </ul>
   </li>
</ol>

<!-- ABOUT THE PROJECT -->
## Features
Future plans can be seen in /raw/TODO.txt

### Searchbar
#### Sorting
* 123: By the amunt of Posts
* abc: Alphabetically
#### Input-matching
* from start: match tags starting with the input (ABC -> ABCx)
* match: match tags containing the input (ABC -> xABCx)
* loose match; match tags which contain the letters of input in order (ABC -> xAxBxCx)
#### No Prefix
Tags in the autocomplete section have their prefix removed (artist:, character:, series:, editor:)
#### Amount of Tags
How many Tags should be shown;
Scrolling does't show more (yet)

### Others
#### resize images
Images get resized to fit your screen. works for height, width, downsizing and upsizing

<!-- Installation -->
## Installation
Which instalation works for your Browser:
* Chrome: <a href="#from-zip">zip</a>
* Edge: <a href="#from-zip">zip</a>
* Opera: <a href="#from-zip">zip</a> and<a href="#from-crx">crx</a>
* Firefox: None, this is a Chromium extension
* Others: No idea; <a href="#from-crx">crx</a> is easier but probablly won't work, <a href="#from-zip">zip</a> has a better chance of working

### From crx

1. Click on "cen_tag_autocomplete.crx"
2. Click on download
3. Your browser should show a promt along the lines of 
   "The extension was disabled because it is from an unknown source"
4. Go to Extensions (the promt might have a button
   oterwise go to "chrome://extensions" and click on cen-plus)
5. Click Install and Confirm it
Open Tabs need to be refreshed for the extension to work

### From zip

1. Click on "cen_tag_autocomplete.zip"
2. Click on download
3. (move it,) unzip it
4. go to "chrome://extensions" in your webbroser
5. Activate Developer Mode 
* Chrome: top-right corner
* Edge: sidebar (left)
6. Click "Load unpacked"
7. Navigate to the unziped folder; select it
Open Tabs need to be refreshed for the extension to work

<p align="right">(<a href="#readme-top">back to top</a>)</p>
