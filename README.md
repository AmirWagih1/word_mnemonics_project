# Word mnemonics project

##  Quick summary
This application tries to find mnemonics starting with same letters for a specified word
- The app uses [Free Dictionary API](https://dictionaryapi.dev/)
## Programming Languages and Frameworks/Libraries used 
- HTML
- CSS
- JS
- Bootstrap 4

## DOC
| Variable | Description |
| ----------- | ----------- |
| **brute_force** | **Boolean** : If `true`, uses brute force to try to fill in missing mnemonics |
| **custome_n_of_loops**  |  **Boolean** : if `true` uses a maximum number of loops when using brute force instead of searching forever trying to find missing mnemonics| 
| **max_loops** |   If `custome_n_of_loops` is `true`, Deterimnes how deep is the search for mnemonics when using **soft mode** in brute force  |
| **banned_words** | **Array** :  list of banned words to use as Mnemonics| 


## Internal Features
#### Brute Force Mode 
- **Soft Mode** : Uses **max_loops** when searching for mnemonic
- **Hard Mode** : Keeps searching forever until it finds a mnemonic for each letter (`custome_n_of_loops = false`)

## How to use
Just open `index.html` or use [**Live Preview**](https://amirwagih1.github.io/word_mnemonics_project/)

