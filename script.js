// Feature variables

  // Turns Brute Force On or Off
  var brute_force = false
  // If brute_force is 'true', Determines whether go in a loop forever trying to fill each letter with a mnemonic
  var custome_n_of_loops = false
  // If custome_n_of_loops is 'true', Sets the maximum search depth
  var max_loops = 5

  // List of banned words
  var banned_words = ["for", "and", "nor", "but", "or", "yet", "so", "both", "and", "whether", "or", "not", "only", "but", "also", "either", "or", "neither", "nor", "just", "so", "the", "as", "if", "then", "rather", "than", "no sooner", "than", "such",
    "that", "so", "that", "after", "although", "as", "as if", "as long as", "as much as", "as soon as", "as far as", "as though", "by the time", "in as much as", "inasmuch", "in order to", "in order that", "in case", "lest", "though", "now that",
    "now since", "now when", "now", "even if", "even", "even though", "provided", "provide that", "if", "if then", "if when", "if only", "just as", "where", "wherever", "whereas", "where if", "whether", "since", "because", "whose", "whoever",
    "unless", "while", "before", "why", "so that", "until", "how", "since", "than", "till", "whenever", "supposing", "when", "or not", "what", "aboard", "about", "above", "across", "after", "against", "along", "amid", "among", "anti", "around",
    "as", "at", "before", "behind", "below", "beneath", "beside", "besides", "between", "beyond", "but", "by", "concerning", "considering", "despite", "down", "during", "except", "excepting", "excluding", "following", "for", "from", "in",
    "inside", "into", "like", "minus", "near", "of", "off", "on", "onto", "opposite", "outside", "over", "past", "per", "plus", "regarding", "round", "save", "since", "than", "through", "to", "toward", "towards", "under", "underneath", "unlike",
    "until", "up", "upon", "versus", "via", "with", "within", "without", "I", "we", "you", "he", "she", "it", "they", "me", "us", "you", "her", "him", "it", "them", "mine", "ours", "yours", "hers", "his", "theirs", "my", "our", "your", "her",
    "his", "their", "myself", "yourself", "herself", "himself", "itself", "ourselves", "yourselves", "themselves", "myself", "yourself", "herself", "himself", "itself", "ourselves", "yourselves", "themselves", "all", "another", "any", "anybody",
    "anyone", "anything", "both", "each", "either", "everybody", "everyone", "everything", "few", "many", "most", "neither", "nobody", "none", "no one", "nothing", "one", "other", "others", "several", "some", "somebody", "someone", "something",
    "such", "such", "that", "these", "this", "those", "what", "whatever", "which", "whichever", "who", "whoever", "whom", "whomever", "whose", "as", "that", "what", "whatever", "which", "whichever", "who", "whoever", "whom", "whomever", "whose",
    "thou", "thee", "thy", "thine", "ye", "a", "a few", "a little", "all", "an", "another", "any", "anybody", "anyone", "anything", "anywhere", "both", "certain", "each", "either", "enough", "every", "everybody", "everyone", "everything",
    "everywhere", "few", "fewer", "fewest", "last", "least", "less", "little", "many", "many a", "more", "most", "much", "neither", "next", "no", "no one", "nobody", "none", "nothing", "nowhere", "once", "one", "said", "several", "some",
    "somebody", "something", "somewhere", "sufficient", "that", "the", "these", "those", "three", "thrice", "twice", "two", "us", "various", "we", "what", "whatever", "which", "whichever", "you", "zero", "especially",
    "am", "are", "is", "was", "were", "regardless","else","nevertheless"]


// Internal Variables
  var current = null
  var used_words = []
  var others = []
  var out = {
    w: [],
    s: [],
    l: [],
    c: [],
    f: [],
    res: []
  }


// Main Functions for producing Mnemonics

  async function mnemon(w, pof = "noun", word_atleast_of_length = 0, use_syn = false) {
    others = []
    used_words = []
    w = w.toLowerCase().trim()
    var data = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + w)
    data = await data.json()
    current = data
    var data_f = data[0].meanings.filter((x) => x.partOfSpeech == pof)

    var res = ""


    for (x of data[0].word) {
      if (/[a-z]/g.test(x.toLowerCase())) {
        res = res + `<h3 class="text-primary d-inline-block">${x.toUpperCase()}</h3>`
        var found = false
        loop:
          for (def of data_f[0].definitions) {
            m = def.definition.split(" ")
            if (use_syn == true) {
              m = def.synonyms
            }


            m = m.filter((l) => l[0].toLowerCase() == x)


            if (m.length > 0) {
              word = m[randomize(0, m.length - 1)]
              if (used_words.includes(word)) {
                continue
              }


              if (checkCond(word, word_atleast_of_length)) {

                res = res + "<h4 class='d-inline-block' onclick='delWord(this)'>(" + word.trim().replaceAll(/[^a-zA-Z\s-]/g, "") + ")</h4>"
                used_words.push(word)
                found = true
                break loop;
              }
            }
          }



      }

      if (!found && brute_force) {
        var old_other_len = others.length

        var w2 = null
        var d2 = data_f[0].definitions[randomize(0, data_f[0].definitions.length - 1)].definition
        var s2 = data_f[0].definitions[randomize(0, data_f[0].definitions.length - 1)]

        if (d2.split(" ").length != 0) {
          w2 = d2.split(" ")[randomize(0, d2.split(" ").length - 1)]
        }
        if (use_syn == true && s2.synonyms.length != 0) {
          var w2 = s2.synonyms[randomize(0, s2.synonyms.length - 1)]
        }


        await mnemon_(w2.toLowerCase().trim(), pof, word_atleast_of_length, use_syn, x).catch((err) => handleErr(err))


        if (custome_n_of_loops) {
          i = 0
          while (i < max_loops - 1 && others.length != 0) {
            await mnemon_(others[randomize(0, others.length - 1)].toLowerCase().trim(), pof, word_atleast_of_length, use_syn, x).catch((err) => handleErr(err))
            i++
          }
        } else {
          while (others.length == 0) {
            var w2 = null
            var d2 = data_f[0].definitions[randomize(0, data_f[0].definitions.length - 1)].definition
            var s2 = data_f[0].definitions[randomize(0, data_f[0].definitions.length - 1)]

            if (d2.split(" ").length != 0) {
              w2 = d2.split(" ")[randomize(0, d2.split(" ").length - 1)]
            }
            if (use_syn == true && s2.synonyms.length != 0) {
              var w2 = s2.synonyms[randomize(0, s2.synonyms.length - 1)]
            }


              await mnemon_(w2.toLowerCase().trim(), pof, word_atleast_of_length, use_syn, x).catch((err) => handleErr(err))

          }
          while (others.length == old_other_len) {
            if (used_words.length != 0) {

              await mnemon_(w2.toLowerCase().trim(), pof, word_atleast_of_length, use_syn, x).catch((err) => handleErr(err))

          }
        }

        if (others.length != 0) {
          res = res + "<h4 class='d-inline-block' onclick='delWord(this)'>(" + others[randomize(0, others.length - 1)].trim().replaceAll(/[^a-zA-Z\s-]/g, "") + ")</h4>"
        }
        others = []
      }
    }

  }

  var res_ = [res, [w, pof, word_atleast_of_length, use_syn, false]]

  return res_
}

  async function mnemon_(w, pof = "noun", word_atleast_of_length = 0, use_syn = false, l) {
    w = w.toLowerCase().trim()
    var data = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + w.trim().replaceAll(/[^a-zA-Z\s]/g, ""))
    data = await data.json()

    var data_f = data[0].meanings[randomize(0, data[0].meanings.length - 1)]
    var res = ""
    if (/[a-z]/g.test(l.toLowerCase())) {
      loop: for (def of data_f.definitions) {
        m = def.definition.split(" ")
        if (use_syn == true) {
          m = def.synonyms
        }

        for (word of m) {
          if (used_words.includes(word)) {
            continue
          }
          if (checkCond(word, word_atleast_of_length) && current[0].word.toLowerCase().trim() != word.toLowerCase().trim()) {
            used_words.push(word)
            others.push(word)
          }

        }

      }
    }
  }

  function mnemon_html(w = document.getElementById("w").value, s = document.getElementById("s").value, l = eval(document.getElementById("l").value), c = document.getElementById("c").checked, f = false) {
    document.getElementById("err").innerHTML = "  generating..."
    if (document.getElementById("bc").checked == true) {
      brute_force = true
    } else {
      brute_force = false
    }

    if (document.getElementById("brute-t").value == "s") {
      custome_n_of_loops = true
    } else {
      custome_n_of_loops = false
    }
    mnemon(w, s, l, c).then(addNewCard).catch(handleErr)
  }

  function mnemon_html_(w = document.getElementById("w").value, s = document.getElementById("s").value, l = eval(document.getElementById("l").value), c = document.getElementById("c").checked, f = false) {
    document.getElementById("err").style.display = "none"

    mnemon(w, s, l, c).then(addNewCard).catch(handleErr)
  }


  // Favourite a word
  function fav(obj) {
    var index = out.res.lastIndexOf(obj.parentNode.parentNode.getElementsByClassName("card-body")[0].innerHTML.trim())

    if (index != -1) {
      if (out.f[index] == false) {

        out.w.push(obj.parentNode.parentNode.getElementsByClassName("card-body")[0].getAttribute("data-w"))
        out.s.push(obj.parentNode.parentNode.getElementsByClassName("card-body")[0].getAttribute("data-s"))
        out.l.push(eval(obj.parentNode.parentNode.getElementsByClassName("card-body")[0].getAttribute("data-l")))
        out.c.push(obj.parentNode.parentNode.getElementsByClassName("card-body")[0].getAttribute("data-c") == "true" ? true : false)
        out.f.push(true)
        out.res.push(obj.parentNode.parentNode.getElementsByClassName("card-body")[0].innerHTML.replaceAll(`'`, `"`).trim())
      }
    }
  }
  // Restore Recent Words
  function restore(f = false) {
    document.getElementById("res").innerHTML = ""
    for (i = 0; i < out.w.length; i++) {
      if (out.f[i] == f) {
        mnemon_html_(out.w[i], out.s[i], out.l[i], out.c[i], out.f[i])
      }
    }

  }

// Helper Functions

   // Handle errors
  function handleErr(err) {
    console.log(err);
    document.getElementById("err").innerHTML = "Error: Please, Make sure that all fields are valid";
  }
   // Add new bootstrap card to html
  function addNewCard(res) {
    document.getElementById("err").innerHTML = ""
    document.getElementById("res").innerHTML = `<div class="card mt-3 border-primary rounded p-0 anim-slide">
            <div class="card-header">
              <div style="float:left">${current[0].word.substring(0,1).toUpperCase() + current[0].word.substring(1,current[0].word.length)}</div>

              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" onclick="del(this)" class="bi bi-x-lg" style="float:right; margin-right:3px;" viewBox="0 0 16 16">
                <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" />
              </svg>

              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" onclick="selectText(this.parentNode.parentNode.getElementsByClassName('card-body')[0])" class="bi bi-clipboard" style="float:right; margin-right:10px;" viewBox="0 0 16 16">
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
              </svg>

              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" onclick="fav(this)" class="bi bi-star" style="float:right; margin-right:10px;" viewBox="0 0 16 16">
                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
              </svg>
            </div>
            <div data-w="${res[1][0]}" data-s="${res[1][1]}" data-l="${res[1][2]}" data-c="${res[1][3]}" data-f="${res[1][4]}" class="card-body mt-3 text-center">${res[0]}</div>
            <div class="text-muted" style="font-size: 15px;margin-left: 10px;margin-bottom: 5px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" fill="currentColor" class="bi bi-info-circle d-inline-block" viewBox="0 0 16 16" style="margin-right: 3px;">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
                  </svg>Click on any word to <div style="font-weight: 550;display:inline-block;">remove</div> it.</div>
          </div>` + document.getElementById("res").innerHTML


    if (out.res.indexOf(res[0].replaceAll(`'`, `"`).trim()) == -1) {
      out.w.push(res[1][0])
      out.s.push(res[1][1])
      out.l.push(res[1][2])
      out.c.push(res[1][3])
      out.f.push(res[1][4])
      out.res.push(res[0].replaceAll(`'`, `"`).trim())
    }

    setTimeout(() => {
      document.getElementsByClassName("card")[0].classList.remove("anim-slide")
    }, 500)

  }
   //depricated
  function copy(obj) {
    navigator.clipboard.writeText(obj.parentNode.parentNode.getElementsByClassName("card-body")[0].innerText).then(function() {
      console.log("Copied to clipboard sucussfully");
      obj.style.color = "green"
    });
  }
   // Delete a card/word
  function del(obj) {
    obj.parentNode.parentNode.classList.add("fade")
    setTimeout(() => obj.parentNode.parentNode.remove(), 500)
  }
   // Check Figures of Speech avalliable for a word
  async function checkFOP(w) {
      document.getElementById("s").innerHTML = ""
      document.getElementById("s").disabled = true
      try {
        var data = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + w.toLowerCase().trim())
        data = await data.json()
        var fop = data[0].meanings.map((m) => m.partOfSpeech)

        fop = [...new Set(fop)]


        for (i = 0; i < fop.length; i++) {
          if (i == 0) {
            document.getElementById("s").innerHTML = document.getElementById("s").innerHTML + `<option selected value="${fop[i]}">${fop[i].substring(0,1).toUpperCase() + fop[i].substring(1,fop[i].length)}</option>`
          } else {
            document.getElementById("s").innerHTML = document.getElementById("s").innerHTML + `<option value="${fop[i]}">${fop[i].substring(0,1).toUpperCase() + fop[i].substring(1,fop[i].length)}</option>`
          }
        }
        document.getElementById("s").disabled = false
      } catch (e) {
        document.getElementById("s").innerHTML = ""
        document.getElementById("s").disabled = true
      }
    }
   // Produce a random number from range [min,max]
  function randomize(min, max) {
      return Math.floor((max - min) * Math.random() + min)
    }
   // Check if a Mnemnic statifies requird condtions
  function checkCond(word, word_atleast_of_length) {
      try {
        r = new RegExp(`\s*${word}\s*`, 'i')
        c = new RegExp(`\s*[a-zA-Z]*${current[0].word}[a-zA-Z]*\s*`, 'i')
        return (word.length >= word_atleast_of_length && banned_words.filter((value) => r.test(value)).length == 0 && !c.test(word))
      } catch {}
    }
   // Delete a Card/Word
  function delWord(obj) {
      if (confirm("Are you sure you want to delete this word?") == true) {
        obj.remove()
      }
    }
   // Select Text
  function selectText(node) {
      document.getSelection().removeAllRanges()
      var range = new Range()
      range.setStart(node, 0)
      range.setEnd(node, node.childElementCount)
      document.getSelection().addRange(range)
    }
