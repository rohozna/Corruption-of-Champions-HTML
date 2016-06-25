var AmilyScene = [];

/*
 * Amily created by aimozg on 02.01.14.
 * Converted to JS by Matraia
 */

addToGameFlags(AMILY_MET, AMILY_MET_AS, AMILY_PC_GENDER, AMILY_OFFER_ACCEPTED, AMILY_AFFECTION, AMILY_OFFERED_DEFURRY, AMILY_FUCK_COUNTER, AMILY_NOT_FURRY, AMILY_WANG_LENGTH, AMILY_PREGNANCY_TYPE, AMILY_INCUBATION, AMILY_BUTT_PREGNANCY_TYPE, AMILY_OVIPOSITED_COUNTDOWN, AMILY_GROSSED_OUT_BY_WORMS, AMILY_FOLLOWER, AMILY_ALLOWS_FERTILITY, FOLLOWER_AT_FARM_AMILY, AMILY_CORRUPT_FLIPOUT, AMILY_TIMES_FUCKED_FEMPC, AMILY_VILLAGE_ENCOUNTERS_DISABLED, AMILY_CONFESSED_LESBIAN, AMILY_WANG_LENGTH, AMILY_WANG_GIRTH, AMILY_HERM_TIMES_FUCKED_BY_FEMPC, AMILY_HERM_QUEST, PC_TIMES_BIRTHED_AMILYKIDS, AMILY_CORRUPT_FLIPOUT, AMILY_VISITING_URTA, AMILY_DRANK_POTENT_MIXTURE);


/*

 Changes to make:

 Insert the Amily sprite. See Rathazul code for how to do that.

 Pregnancy Event code needs to be completed so those code blocks can be uncommented and checked.

 The initial male meeting offers a rejection option because she's a furry. See amilyNoFur(). Part of the text for that option reveals the ingredients necessary to defur Amily. However, players don't see these ingredients until much later in the game. Amily is often encountered early. How is the player going to know what the ingredients are? This scene is possible several times throughout the code.

 Possible solution. If player goes so far as to reach the Desperate Amily scenes and then rejects her for furriness, I can see her telling the player how to change her. Amily obviously wants the player by this point.

 Need to correct references to leaving the area for good since Shouldra is a part of the town ruins. That code was probably put in before she was put in.

 Probably need author permission, but the high-affection sex path could use some expanding. It can take quite a while to get to five litters and having nearly the same scene pop each time is annoying. The lower-affection paths have multiple choices.

 First time Amily Lesbian scene works well, but the code immediately has Amily jump to becoming a herm. This locks out subsequent lesbian scenes in the town ruins. Leaving code as is for now, but a simple affection check should do it. Also, lesbian sex and herm sex with Amily doesn't increase her affection at all. I feel this should be changed.

 undefined error in amilyHermOnFemalePC(). Just have to click next to get past it, but it is something to investigate.

 Something is wrong in the first time scenes. The program is choking on (player.cocks[0].cockLength >= 14) when it didn't before.

 Check gender flag checking.

 Rewrite the pepper part of the conversation tree.

 Change conversation tree options to match only the ones the player has had an encounter with. Use the codex flags to determine what the player has seen.

 Gender switching convos need to be checked. Need to make a gender change scene debugging thing in the Camp code.

 Giant Bee conversation: Amily says she's been willing to host giant bee eggs on occasion, but will pointedly remind the player she was a virgin when they met. And the player makes no comment about HOW this is possible? Unless anal pregnancy is a thing in Ingnam, this seems like a strange reaction.

 Figure out how to remove the purified incubus draft from the player's inventory when making Amily a herm.

 Fix all tooltip entries (low priority)

 Fix entries in main Amily function for descriptions.

 Fix player.Short variable

 Go through completed Amily list and find out everything that's been commented out. Fix or remove.

 */

//------------
//Amily Definitions and initial variables
//------------

//NEEDS PLAYER/CREATURE VARS
function Amily() {
    this.a = "";
    this.short = "Amily";
    //this.imageName = "amily";
    this.long = "You are currently fighting Amily. The mouse-morph is dressed in rags and glares at you in rage, knife in hand. She keeps herself close to the ground, ensuring she can quickly close the distance between you two or run away.";
    // this.plural = false;
    this.createVagina(false, VAGINA_WETNESS_NORMAL, VAGINA_LOOSENESS_NORMAL);
    this.createStatusEffect(StatusEffects.BonusVCapacity, 48, 0, 0, 0);
    this.createBreastRow(Appearance.breastCupInverse("C"));
    this.ass.analLooseness = ANAL_LOOSENESS_VIRGIN;
    this.ass.analWetness = ANAL_WETNESS_DRY;
    this.tallness = 4 * 12;
    this.hipRating = HIP_RATING_AMPLE;
    this.buttRating = BUTT_RATING_TIGHT;
    this.skinTone = "tawny";
    this.skinType = SKIN_TYPE_FUR;
    //this.skinDesc = Appearance.Appearance.DEFAULT_SKIN_DESCS[SKIN_TYPE_FUR];
    this.hairColor = "brown";
    this.hairLength = 5;
    this.str = 20;
    this.tou = 30;
    this.spe = 85;
    this.inte = 60;
    this.lib = 45;
    this.sens = 45;
    this.cor = 10;
    this.weapon.equipmentName = "knife";
    this.weapon.verb = "slash";
    //this.weaponAttack = 6;
    this.armorName = "rags";
    //this.armorDef = 1;
    this.bonusHP = 20;
    this.lust = 20;
    this.lustVuln = 0.85;
    this.level = 4;
    this.gems = 2 + rand(5);
    //this.drop = NO_DROP;
    //checkMonster();
}

var sexForced = false; // Used to get around a nasty bug.


// Used for later checks when Amily is a follower. Necessary?
AmilyScene.amilyFollower = function() {
    if (gameFlags[AMILY_FOLLOWER] > 0) {
        //Amily not a follower while visiting Urta
        if (gameFlags[AMILY_VISITING_URTA] != 0) {
            return true;
        }
        else return false;
    }
};

// A check function to see if Amily is corrupt or not. Necessary?
AmilyScene.amilyCorrupt = function() {
    if (gameFlags[AMILY_FOLLOWER] == 2) {
        return true;
    }
    else return false;
};

//-------------
// Amily standard scenes in Town Ruins
//------------- 


// AmilyScene.start begins encounters in the Town Ruins - MAIN WORK LOOP. CLEAN OTHER LOOPS BEFORE RETURNING HERE
AmilyScene.start = function () {
    // BOOKKEEPING
    menu();
    // set initial gender flag, these may need to be changed throughout!
    if (gameFlags[AMILY_MET] == 0) {
        gameFlags[AMILY_PC_GENDER] = player.gender;
    }
    // Reset worm block if worms have been eliminated from the player
    if (gameFlags[AMILY_GROSSED_OUT_BY_WORMS] == 1) {
        if (player.findStatusEffect(StatusEffects.Infested) < 0) {
            gameFlags[AMILY_GROSSED_OUT_BY_WORMS] = 0;
        }
    }


    // AMILY ENCOUNTER TURNED OFF
    // Check to see if we've taken Amily out of the picture. If so, put up the message from earlier. Commenting out until we can set these flags
    /*
     if (flags[kFLAGS.AMILY_IS_BATMAN] > 0 || flags[kFLAGS.AMILY_VILLAGE_ENCOUNTERS_DISABLED] == 1  || flags[kFLAGS.AMILY_TREE_FLIPOUT] > 0) {
     outputText("You enter the ruined village cautiously. There are burnt-down houses, smashed-in doorways, ripped-off roofs... everything is covered with dust and grime. You explore for an hour, but you cannot find any sign of another living being, or anything of value. The occasional footprint from an imp or a goblin turns up in the dirt, but you don't see any of the creatures themselves. It looks like time and passing demons have stripped the place bare since it was originally abandoned. Finally, you give up and leave. You feel much easier when you're outside of the village.");
     doNext(camp.returnToCampUseOneHour);
     return;
     }
     */

    // If we've corrupted the poor mousie, then we need to show we've done so.
    if (gameFlags[AMILY_FOLLOWER] == 2) {

        outputText("You enter the ruined village, still laughing at your past nefarious deeds. Maybe it's just your imagination, but you feel like this entire place reeks of corruption now... You explore for an hour, then go back to your camp, knowing your tainted slave will be more than happy to satisfy your urges.");
        doNext(Camp.returnToCampUseOneHour);
        return;
    }
    // Amily can't be encountered due to worms, high initial corruption, or has flipped out due to the player's increasing corruption

    if (gameFlags[AMILY_GROSSED_OUT_BY_WORMS] == 1 || player.cor > 25 || gameFlags[AMILY_CORRUPT_FLIPOUT] > 0) {
        outputText("You enter the ruined village cautiously. There are burnt-down houses, smashed-in doorways, ripped-off roofs... everything is covered with dust and grime. For hours you explore, but you cannot find any sign of another living being, or anything of value. The occasional footprint from an imp or a goblin turns up in the dirt, but you don't see any of the creatures themselves. It looks like time and passing demons have stripped the place bare since it was originally abandoned. Finally, you give up and leave. You feel much easier when you're outside of the village – you had the strangest sensation of being watched while you were in there.");
        doNext(Camp.returnToCampUseOneHour);
        return;
    }


    // ENCOUNTERING AMILY WHILE CORRUPT/CORRUPTION PATH
    // Fight between Amily and player if you are too corrupt. Requires that you've met Amily once

    if (gameFlags[AMILY_CORRUPT_FLIPOUT] == 0 && gameFlags[AMILY_MET] > 0 && (player.cor > 25 + player.corruptionTolerance() || player.cor > 75)) {
        displaySprite("amily");
        AmilyScene.meetAmilyAsACorruptAsshat();
        return;
    }

    // Amily corruption path
    if (gameFlags[AMILY_CORRUPT_FLIPOUT] > 0 && player.cor > 25) {
        //Cook amily a snack if player doesnt have key item for it.
        if (player.hasKeyItem("Potent Mixture") < 0 && gameFlags[AMILY_DRANK_POTENT_MIXTURE] < 3) {
            AmilyScene.cookAmilyASnack();
            return;
        }
    }
    /*
     //Has snacks!
     else {
     displaySprite("amily");
     if (flags[kFLAGS.UNKNOWN_FLAG_NUMBER_00170] == 0) stalkingZeAmiliez();
     else if (flags[kFLAGS.UNKNOWN_FLAG_NUMBER_00170] == 1) stalkingZeAmiliez2();
     else if (flags[kFLAGS.UNKNOWN_FLAG_NUMBER_00170] == 2) stalkingZeAmiliez3();
     else rapeCorruptAmily4Meeting();
     return;
     }
     }
     */


    //If Amily is ready to give birth, do this
    /*
     if (pregnancy.isPregnant && pregnancy.incubation == 0) {
     displaySprite("amily");
     fuckingMouseBitchPopsShitOut();
     pregnancy.knockUpForce(); //Clear Pregnancy
     return;
     }
     */

    // We will need to put a switch here between amily and amily-defurred. Will do after Amily defurring code is implemented. Probably another one too for when she's in camp. That's how the Rathazul code is set up.
    displaySprite("amily");

    // Male Meeting - Complete until Pregnancy is fixed
    if (player.gender == 1) {
        if (gameFlags[AMILY_MET] == 0) {
            //Set flag for what she met the player as.
            gameFlags[AMILY_MET_AS] = player.gender;
            //set 'met' to true
            gameFlags[AMILY_MET]++;
            outputText("You wind your way deep into the maze of dusty crumbling buildings and twisted saplings, looking for any sign of life – or, failing that, something that can help you in your quest.  Bending down to rummage through an old heap of rubbish, you complain aloud that this is hardly the sort of thing you expected to be doing as a champion. Suddenly, you hear a 'thwip' and something shoots past your face, embedding into the stone beside your head and trembling with the impact.<br><br>");

            outputText("\"<i>Don't make any sudden moves!</i>\" A voice calls out, high pitched and a little squeaky, but firm and commanding. You freeze to avoid giving your assailant a reason to shoot at you again. \"<i>Stand up and turn around, slowly,</i>\" it commands again. You do as you are told.<br><br>");
            //Jojo previously encountered

            if (gameFlags[JOJO_MET] == 1) {
                outputText("The creature that has cornered you is clearly of the same race as Jojo, though notably a female member of his species. Her fur is thick with dust, but you can still easily make out its auburn color. Her limbs and midriff are wiry, hardened as much by meals that are less than frequent as by constant exercise and physical exertion. Her buttocks are non-existent, and her breasts can't be any larger than an A-cup. She wears a tattered pair of pants and an equally ragged-looking shirt. A very large and wicked-looking dagger – more of a short sword really – is strapped to her hip, and she is menacing you with a blowpipe.<br><br>");
            } else {
                outputText("You have been cornered by a very strange being: a bipedal female humanoid with the unmistakable features of a giant mouse; paw-like feet, a muzzled head with long whiskers, large mouse ears, and a body covered in dust-caked auburn fur. It doesn't look like she has had a very easy life; her clothing consists of a dirty, tattered set of pants and shirt, while her limbs and midriff are wiry, hardened as much by meals that are less than frequent as by constant exercise and physical exertion. Her buttocks are non-existent, and her breasts can't be any larger than an A-cup. Still, she looks quite capable of defending herself; not only is she brandishing a blowpipe, clearly ready to spit another doubtlessly-poisoned dart at you, but she has a formidable-looking knife strapped to her hip.<br><br>");
            }
            outputText("She looks at you for a few long moments, and then lowers her blowpipe, \"<i>I'm sorry about that, but I thought you were another demon. They destroyed this place years ago, but some of the damn scavengers still occasionally drift through. Not so much lately, of course. I've made something of an impression on them.</i>\" She grins malevolently, one hand caressing the blade of her knife in an almost sensual fashion. \"<i>My name is Amily, the last survivor of this village. All of my people are gone now; they're scattered, dead, enslaved, or worse. What about you? ");

            if (player.humanScore() > 4) {
                outputText("Are you ");
            } else {
                outputText("Were you ");
            }

            outputText("one of those... humans, I've heard sometimes wander into this world?</i>\"<br><br>");

            outputText("You admit that, yes, you are a human, and then ask her why she remains here in this empty wasteland of a settlement.<br><br>");

            outputText("\"<i>I was born here, I grew up here, and I would have gotten married and settled down here if it hadn't been for those demons.</i>\" She spits the word 'demons' with contempt. \"<i>After it was all over, I had nowhere else to go. So I stayed here. I've still got nowhere else to go, to be honest. I haven't found any other settlements of my own people, and I'd sooner die than give myself over to the demons. But it seems that if I'm ever going to see more of my people living free, I'm going to have to take the leading role...</i>\"<br><br>");

            outputText("She stares at you intently, and you ask her what the matter is.<br><br>");

            outputText("\"<i>You see, that role I was talking about? I've had a long time to think about it, and there's no one else for it. If there are ever going to be more of my kind born into freedom, they're going to have to be born. Literally; I need to find a mate that is pure, one that can give me strong and pure children of my own kind,</i>\" she explains, one hand absently touching her flat belly. \"<i>The few males of my kind that I've managed to find are demon slaves – far too corrupt to make suitable mates, even if I could free them. I've heard, though, that humans are strangely weak breeders; your seed would be free of taint, and you would father more of my own kind. Unlike, say, an imp or a minotaur.</i>\"<br><br>");

            outputText("She tucks her blowpipe into her belt and takes several uncertain steps towards you, trying to appear winning – flirtatious even – despite her grimy appearance and clear inexperience with the matter. \"<i>Please, will you help me? You said something about being a champion – If you lay with me and help me bring more of my people into this world, free of the demons and untouched by their perverse taint, you will be striking another kind of blow against their corrupt stranglehold on Mareth.</i>\"<br><br>");

            outputText("What do you do?");

            gameFlags[AMILY_PC_GENDER] = player.gender;
            //Accept Eagerly / Accept Hesitantly / Reject Harshly / Refuse Gently
            addButton(0, "Eager", AmilyScene.acceptAmilysOfferEagerly, null, null, null, "Accept Amily's Offer Eagerly.");
            addButton(1, "Hesitant", AmilyScene.acceptAmilysOfferHesitantly, null, null, null, "Accept Amily's Offer Hesitantly.");
            addButton(2, "Refuse", AmilyScene.refuseAmilysOffer, null, null, null, "Your mission is more important. You can't let her distract you!");
            addButton(3, "Reject", AmilyScene.amilyNoFur, null, null, null, "You can't imagine kissing, let alone breeding with, a mouse!");
            return;
        } else if (player.gender == 1 && gameFlags[AMILY_OFFER_ACCEPTED] == 0) {
            outputText("Wandering into the ruined village, you set off in search of Amily.<br><br>");
            /*NOPE!
             //[Player meets the requirements to stalk Amily]
             if (player.spe > 50 && player.inte > 40) {
             outputText("Using all of your knowledge, skill and cunning, you sneak and squirm through the ruins until you finally find yourself coming up right behind the dusty mouse girl. She's picking berries off of a small bush and hasn't noticed you yet.<br><br>");
             outputText("How do you approach her?");
             //Announce yourself / Scare her
             simpleChoices("Announce",remeetingAmilyAnnounceSelf,"Scare",remeetingAmilyScare,"",0,"",0,"",0);
             }
             //[Player does not meets the requirements to stalk Amily]*/
            //else { */
            outputText("After wondering for a while how on earth you are going to track down Amily, you hear a whistle. Looking around, you see her waving cheekily at you from around a corner; it's pretty obvious that you have a long way to go before you'll be able to beat her at this kind of game.<br><br>");
            gameFlags[AMILY_PC_GENDER] = player.gender;
            AmilyScene.amilyRemeetingContinued();
            return;
            
        }
        //Desperate Plea response (Affection 50 without any sex, requires PC to be male in previous encounter)
        if (gameFlags[AMILY_AFFECTION] >= 50 && gameFlags[AMILY_FUCK_COUNTER] == 0 && gameFlags[AMILY_PC_GENDER] == 1) {
            outputText("Wandering into the ruined village, you set off in search of Amily.<br><br>");
            /*NOPE! (This was commented out in original COC)
             [Player meets the requirements to stalk Amily]
             if (player.spe > 50 && player.inte > 40) {
             outputText("Using all of your knowledge, skill and cunning, you sneak and squirm through the ruins until you finally find yourself coming up right behind the dusty mouse girl. She's picking berries off of a small bush and hasn't noticed you yet.<br><br>");
             outputText("How do you approach her?");
             //Announce yourself / Scare her
             simpleChoices("Announce",announceSelfOnDesperatePleaMeeting,"Scare Her",scareAmilyOnDesperatePleaMeeting,"",0,"",0,"",0);
             }
             */
            outputText("After wondering for a while how on earth you are going to track down Amily, you hear a whistle. Looking around, you see her waving cheekily at you from around a corner; it's pretty obvious that you have a long way to go before you'll be able to beat her at this kind of game.<br><br>");
            outputText("\"<i>Ah... do you have the time to talk? There's something I want to get off my chest,</i>\" Amily nervously asks.<br><br>");
            outputText("Curious what she has to say, you agree.<br><br>");
            outputText("Amily scuffs the ground with one of her finger-like toe claws, looking down at it as if it was the most interesting thing in the world – or as if she doesn't dare to look you in the eyes. \"<i>I... You know what I've been asking of you; from you, and you keep turning me down... but you kept talking to me, asking me about myself. You wanted to get to know me, but... why don't you want to know ALL of me? I... I want to give myself to you. You're the nicest, kindest man I've met – even before the demons destroyed my village. I want to be with you... but you don't seem to want to be with me.</i>\" She looks up to you at last, her eyes wet with tears. \"<i>Is there something wrong with me? Can't you like me in that way?</i>\" she pleads.<br><br>");
            //Accept her / Turn her down gently / Turn her down bluntly
            addButton(0, "Accept Her", AmilyScene.desperateAmilyPleaAcceptHer, null, null, null, "Tooltip to be added.");
            if (gameFlags[AMILY_NOT_FURRY] == 0) {
                addButton(1, "Reject Furry", AmilyScene.amilyNoFur, null, null, null, "Tooltip to be added.");
            }
            addButton(2, "Reject Gently", AmilyScene.desperateAmilyPleaTurnDown, null, null, null, "Tooltip to be added.");
            addButton(3, "Blunt Reject", AmilyScene.desperateAmilyPleaTurnDownBlunt, null, null, null, "Tooltip to be added");
        } else {
            AmilyScene.amilyStandardMeeting();
        }
    }

    // Female Meeting
    else if (player.gender == 2) {
        //First time
        if (gameFlags[AMILY_MET] == 0) {
            //Set flag for what she met the player as.
            gameFlags[AMILY_MET_AS] = player.gender;
            //set 'met' to true
            gameFlags[AMILY_MET]++;
            outputText("You wind your way deep into the maze of dusty crumbling buildings and twisted saplings, looking for any sign of life – or, failing that, something that can help you in your quest.  Bending down to rummage through an old heap of rubbish, you complain aloud that this is hardly the sort of thing you expected to be doing as a champion. Suddenly, you hear a 'thwip' and something shoots past your face, embedding into the stone beside your head and trembling with the impact.<br><br>");

            outputText("\"<i>Don't make any sudden moves!</i>\" A voice calls out, high pitched and a little squeaky, but firm and commanding. You freeze to avoid giving your assailant a reason to shoot at you again. \"<i>Stand up and turn around, slowly,</i>\" it commands again. You do as you are told.<br><br>");
            if (gameFlags[JOJO_MET] = 1) {
                outputText("The creature that has cornered you is clearly of the same race as Jojo, though notably a female member of his species. Her fur is thick with dust, but you can still easily make out its auburn color. Her limbs and midriff are wiry, hardened as much by meals that are less than frequent as by constant exercise and physical exertion. Her buttocks are non-existent, and her breasts can't be any larger than an A-cup. She wears a tattered pair of pants and an equally ragged-looking shirt. A very large and wicked-looking dagger – more of a short sword really – is strapped to her hip, and she is menacing you with a blowpipe.<br><br>");
            } else {
                outputText("You have been cornered by a very strange being: a bipedal female humanoid with the unmistakable features of a giant mouse; paw-like feet, a muzzled head with long whiskers, large mouse ears, and a body covered in dust-caked auburn fur. It doesn't look like she has had a very easy life; her clothing consists of a dirty, tattered set of pants and shirt, while her limbs and midriff are wiry, hardened as much by meals that are less than frequent as by constant exercise and physical exertion. Her buttocks are non-existent, and her breasts can't be any larger than an A-cup. Still, she looks quite capable of defending herself; not only is she brandishing a blowpipe, clearly ready to spit another doubtlessly-poisoned dart at you, but she has a formidable-looking knife strapped to her hip.<br><br>");
            }
            outputText("She looks at you for a few long moments, and then lowers her blowpipe, \"<i>I'm sorry about that, but I thought you were another demon. They destroyed this place years ago, but some of the damn scavengers still occasionally drift through. Not so much lately, of course. I've made something of an impression on them.</i>\" She grins malevolently, one hand caressing the blade of her knife in an almost sensual fashion. \"<i>My name is Amily, the last survivor of this village. All of my people are gone now; they're scattered, dead, enslaved, or worse. What about you? ");
            if (player.humanScore() > 4) outputText("Are you ");
            else outputText("Were you ");
            outputText("one of those... humans, I've heard sometimes wander into this world?</i>\"<br><br>");

            outputText("You admit that, yes, you are a human, and then ask her why she remains here in this empty wasteland of a settlement.<br><br>");

            outputText("\"<i>I was born here, I grew up here, and I would have gotten married and settled down here if it hadn't been for those demons.</i>\" She spits the word 'demons' with contempt. \"<i>After it was all over, I had nowhere else to go. So I stayed here. I've still got nowhere else to go, to be honest. I haven't found any other settlements of my own people, and I'd sooner die than give myself over to the demons. But it seems that if I'm ever going to see more of my people living free, I'm going to have to take the leading role...</i>\"<br><br>");

            outputText("She shakes her head and smiles at you wistfully. \"<i>Listen to me, rambling. I'm sorry again for attacking you. But, take care out there; there's a lot of freaky monsters that will do the most unspeakable things to a woman if they can catch her.</i>\"<br><br>");

            outputText("You thank her, and she brushes it off.<br><br>");

            outputText("\"<i>Hey, us girls gotta stick together, right?</i>\" She winks at you then wanders off behind a partially collapsed wall, disappearing into the rubble.");
            //Set flag for 'last gender met as'
            gameFlags[AMILY_PC_GENDER] = player.gender;
            doNext(Camp.returnToCampUseOneHour);
            //return;
        }
        //Lesbo lovin confession!
        if (gameFlags[AMILY_CONFESSED_LESBIAN] == 0 && gameFlags[AMILY_AFFECTION] >= 25) {
            AmilyScene.amilyLesbian();
            //return;
        }

        //If PC shot down love confession, cap affection at 35 and re-offer?
        if (gameFlags[AMILY_AFFECTION] > 35 && gameFlags[AMILY_CONFESSED_LESBIAN] == 1) {
            gameFlags[AMILY_AFFECTION] = 35;
            AmilyScene.amilyLesbian();
            //return;
        }

        //Amily totally grows a wang for you once she loves you

        if (gameFlags[AMILY_CONFESSED_LESBIAN] == 2 && gameFlags[AMILY_WANG_LENGTH] == 0) {
            AmilyScene.amilyPostConfessionGirlRemeeting();
            //return;
        } else {
            AmilyScene.amilyStandardMeeting();
        }

    }

    // Herm meeting.
    else if (player.gender == 3) {

        //First time. Amily will meet you once and reject you until you change gender.
        if (gameFlags[AMILY_MET] == 0) {
            //Set flag for what she met the player as.
            gameFlags[AMILY_MET_AS] = player.gender;
            //set 'met' to true
            gameFlags[AMILY_MET]++;
            outputText("You wind your way deep into the maze of dusty crumbling buildings and twisted saplings, looking for any sign of life – or, failing that, something that can help you in your quest.  Bending down to rummage through an old heap of rubbish, you complain aloud that this is hardly the sort of thing you expected to be doing as a champion. Suddenly, you hear a 'thwip' and something shoots past your face, embedding into the stone beside your head and trembling with the impact.<br><br>");

            outputText("\"<i>Don't make any sudden moves!</i>\" A voice calls out, high pitched and a little squeaky, but firm and commanding. You freeze to avoid giving your assailant a reason to shoot at you again. \"<i>Stand up and turn around, slowly,</i>\" it commands again. You do as you are told.<br><br>");
            if (gameFlags[JOJO_MET] > 0) {
                outputText("The creature that has cornered you is clearly of the same race as Jojo, though notably a female member of his species. Her fur is thick with dust, but you can still easily make out its auburn color. Her limbs and midriff are wiry, hardened as much by meals that are less than frequent as by constant exercise and physical exertion. Her buttocks are non-existent, and her breasts can't be any larger than an A-cup. She wears a tattered pair of pants and an equally ragged-looking shirt. A very large and wicked-looking dagger – more of a short sword really – is strapped to her hip, and she is menacing you with a blowpipe.<br><br>");
            } else {
                outputText("You have been cornered by a very strange being: a bipedal female humanoid with the unmistakable features of a giant mouse; paw-like feet, a muzzled head with long whiskers, large mouse ears, and a body covered in dust-caked auburn fur. It doesn't look like she has had a very easy life; her clothing consists of a dirty, tattered set of pants and shirt, while her limbs and midriff are wiry, hardened as much by meals that are less than frequent as by constant exercise and physical exertion. Her buttocks are non-existent, and her breasts can't be any larger than an A-cup. Still, she looks quite capable of defending herself; not only is she brandishing a blowpipe, clearly ready to spit another doubtlessly-poisoned dart at you, but she has a formidable-looking knife strapped to her hip.<br><br>");
            }
            outputText("She looks at you for a few long moments, and then lowers her blowpipe, \"<i>I'm sorry about that, but I thought you were another demon. They destroyed this place years ago, but some of the damn scavengers still occasionally drift through. Not so much lately, of course. I've made something of an impression on them.</i>\" She grins malevolently, one hand caressing the blade of her knife in an almost sensual fashion. \"<i>My name is Amily, the last survivor of this village. All of my people are gone now; they're scattered, dead, enslaved, or worse. What about you? ");
            if (player.humanScore() > 4) outputText("Are you ");
            else outputText("Were you ");
            outputText("one of those... humans, I've heard sometimes wander into this world?</i>\"<br><br>");

            outputText("You admit that, yes, you are a human, and then ask her why she remains here in this empty wasteland of a settlement.<br><br>");

            outputText("\"<i>I was born here, I grew up here, and I would have gotten married and settled down here if it hadn't been for those demons.</i>\" She spits the word 'demons' with contempt. \"<i>After it was all over, I had nowhere else to go. So I stayed here. I've still got nowhere else to go, to be honest. I haven't found any other settlements of my own people, and I'd sooner die than give myself over to the demons. But it seems that if I'm ever going to see more of my people living free, I'm going to have to take the leading role...</i>\"<br><br>");

            outputText("She looks thoughtful. \"<i>You know...</i>\" She begins, but stops and ");
            //[If breasts are flat, manly breasts]
            if (player.biggestTitSize() < 1) outputText("sniffs the air intensely, her whiskers quivering. ");
            //[If breasts are A-cup or bigger]
            else outputText("stares at the bulge in your top, as well as the bulge in your bottom.  ");
            outputText("\"<i>Never mind,</i>\" she says after a moment. \"<i>You're a hermaphrodite, aren't you? Forget I mentioned it.</i>\"<br><br>");

            outputText("She turns and walks away, vanishing into the dust and the rubble like magic.");
            //Set flag for 'last gender met as'
            gameFlags[AMILY_PC_GENDER] = player.gender;
            doNext(Camp.returnToCampUseOneHour);
        }
        if (((gameFlags[AMILY_AFFECTION] >= 15 && rand(3) == 0) || gameFlags[AMILY_AFFECTION] >= 20) && gameFlags[AMILY_HERM_QUEST] == 0) {
            AmilyScene.whyNotHerms();
            //return;
        }

        if (gameFlags[AMILY_HERM_QUEST] == 1) {
            AmilyScene.hermRenegotiate();
            //return;
        } else {
            AmilyScene.amilyStandardMeeting();
        }

    }

    // Genderless meeting
    else if (player.gender == 0) {
        //[First Meeting]
        if (gameFlags[AMILY_MET] == 0) {
            gameFlags[AMILY_MET_AS] = player.gender;
            //set 'met' to true
            gameFlags[AMILY_MET]++;
            outputText("You wind your way deep into the maze of dusty crumbling buildings and twisted saplings, looking for any sign of life – or, failing that, something that can help you in your quest.  Bending down to rummage through an old heap of rubbish, you complain aloud that this is hardly the sort of thing you expected to be doing as a champion. Suddenly, you hear a 'thwip' and something shoots past your face, embedding into the stone beside your head and trembling with the impact.<br><br>");

            outputText("\"<i>Don't make any sudden moves!</i>\" A voice calls out, high pitched and a little squeaky, but firm and commanding. You freeze to avoid giving your assailant a reason to shoot at you again. \"<i>Stand up and turn around, slowly,</i>\" it commands again. You do as you are told.<br><br>");
            if (gameFlags[JOJO_MET] > 0) {
                outputText("The creature that has cornered you is clearly of the same race as Jojo, though notably a female member of his species. Her fur is thick with dust, but you can still easily make out its auburn color. Her limbs and midriff are wiry, hardened as much by meals that are less than frequent as by constant exercise and physical exertion. Her buttocks are non-existent, and her breasts can't be any larger than an A-cup. She wears a tattered pair of pants and an equally ragged-looking shirt. A very large and wicked-looking dagger – more of a short sword really – is strapped to her hip, and she is menacing you with a blowpipe.<br><br>");
            } else {
                outputText("You have been cornered by a very strange being: a bipedal female humanoid with the unmistakable features of a giant mouse; paw-like feet, a muzzled head with long whiskers, large mouse ears, and a body covered in dust-caked auburn fur. It doesn't look like she has had a very easy life; her clothing consists of a dirty, tattered set of pants and shirt, while her limbs and midriff are wiry, hardened as much by meals that are less than frequent as by constant exercise and physical exertion. Her buttocks are non-existent, and her breasts can't be any larger than an A-cup. Still, she looks quite capable of defending herself; not only is she brandishing a blowpipe, clearly ready to spit another doubtlessly-poisoned dart at you, but she has a formidable-looking knife strapped to her hip.<br><br>");
            }
            outputText("She looks at you for a few long moments, and then lowers her blowpipe, \"<i>I'm sorry about that, but I thought you were another demon. They destroyed this place years ago, but some of the damn scavengers still occasionally drift through. Not so much lately, of course. I've made something of an impression on them.</i>\" She grins malevolently, one hand caressing the blade of her knife in an almost sensual fashion. \"<i>My name is Amily, the last survivor of this village. All of my people are gone now; they're scattered, dead, enslaved, or worse. What about you? ");
            if (player.humanScore() > 4) outputText("Are you ");
            else outputText("Were you ");
            outputText("one of those... humans, I've heard sometimes wander into this world?</i>\"<br><br>");

            outputText("You admit that, yes, you are a human, and then ask her why she remains here in this empty wasteland of a settlement.<br><br>");

            outputText("\"<i>I was born here, I grew up here, and I would have gotten married and settled down here if it hadn't been for those demons.</i>\" She spits the word 'demons' with contempt. \"<i>After it was all over, I had nowhere else to go. So I stayed here. I've still got nowhere else to go, to be honest. I haven't found any other settlements of my own people, and I'd sooner die than give myself over to the demons. But it seems that if I'm ever going to see more of my people living free, I'm going to have to take the leading role...</i>\"<br><br>");

            //(If breasts < A-Cup)
            if (player.biggestTitSize() < 1) {
                outputText("She stares at you intently, and you ask her what the matter is.<br><br>");

                outputText("\"<i>You see, that role I was talking about? I've had a long time to think about it, and there's no one else for it. If there are ever going to be more of my kind born into freedom, they're going to have to be born. Literally; I need to find a mate that is pure, one that can give me strong and pure children of my own kind,</i>\" she explains, one hand absently touching her flat belly. \"<i>The few males of my kind that I've managed to find are demon slaves – far too corrupt to make suitable mates, even if I could free them. I've heard, though, that humans are strangely weak breeders; your seed would be free of taint, and you would father more of my own kind. Unlike, say, an imp or a minotaur.</i>\"<br><br>");

                outputText("She tucks her blowpipe into her belt and takes several uncertain steps towards you, trying to appear winning – flirtatious even – despite her grimy appearance and clear inexperience with the matter. \"<i>Please, will you help me? You said something about being a champion – if you lay with me and help me bring more of my people into this world, free of the demons and untouched by their perverse taint, you will be striking another kind of blow against their corrupt stranglehold on Mareth.</i>\"<br><br>");

                outputText("Sheepishly, you look down at the ground and confess that as much as you might like to help, that's actually impossible.<br><br>");

                outputText("Amily looks hurt. \"<i>Why?</i>\" she demands desperately.<br><br>");

                outputText("Highly embarrassed but unable to think of a way to articulate it, you drop your pants and let her see the flat and featureless expanse of flesh that is your crotch.<br><br>");

                outputText("Amily's eyes bug out, her jaw falls slack and she stares at you, clearly gobsmacked. Then she spits a stream of incoherent, dumbfounded profanities. Finally, she shakes her head. \"<i>Well... that's a new one. I guess... it makes sense. Damn, just when you thought you'd seen it all. I suppose I should go now,</i>\" she tells you and turns to leave.<br><br>");

                outputText("She stops, however, just before rounding a wall. \"<i>There's this stuff you'll find in bottles called Incubus Draft. If you drink that, it'll make you a boy - but I'd find an alchemist first, so he can remove the corruption from it.</i>\"<br><br>");

                outputText("She continues walking away. After she has vanished, though, another musing drifts back to you. \"<i>There's also this stuff called Succubus Milk you can do the same thing with, if you want to be a girl.</i>\"<br><br>");
            }
            //(If breasts > A-Cup)
            else {
                outputText("She shakes her head and smiles at you wistfully. \"<i>Listen to me, rambling. I'm sorry again for attacking you. But, take care out there; there's a lot of freaky monsters that will do the most unspeakable things to a woman if they can catch her.</i>\"<br><br>");

                outputText("Blushing, you explain to her that you aren't actually a woman. She looks very puzzled at this.<br><br>");

                outputText("\"<i>But you have boobs... and I don't see a crotch-bulge,</i>\" she says, sounding almost petulant. \"<i>I don't smell a vagina, either... Wait, are you telling me you don't have either pair of genitals?</i>\" she asks, clearly dumbfounded.<br><br>");

                outputText("Embarrassed, you admit that is so.<br><br>");

                outputText("Amily stares at you, clearly at a loss for words, and then shakes her head in disbelief. She tries to give you a smile. \"<i>Well... us girls gotta stick together, right? If you look for a bottle of Succubus Milk – Imps seem to carry it on occasion, though I don't know why – then you can drink it to get your vagina back. Also, I'd find an alchemist first, so he can remove the corruption from it.</i>\"<br><br>");

                outputText("Having evidently regained her confidence, she winks and then vanishes behind a tumbled-down wall, leaving you alone.");

            }
            //Set flag for 'last gender met as'
            gameFlags[AMILY_PC_GENDER] = player.gender;
            doNext(Camp.returnToCampUseOneHour);
            //return;
        } else {
            AmilyScene.amilyStandardMeeting();
        }
    }
    //Reach this, show default explore message and return to camp.
    else {
        AmilyScene.amilyMeetingFailed();
    }

}
;

// Standard meeting loop after first time - NEED SPRITE IMAGE AND PREGNANCY EVENTS TO FINISH
AmilyScene.amilyStandardMeeting = function() {
    clearOutput();
    // Amily does NOT like seeing the player change gender
    outputText("Curious on how Amily is holding up, you head back into the ruined village. This time you don't bother trying to hide your presence, hoping to attract Amily's attention quicker. After all, she did say that the place is basically empty of anyone except her, and you can otherwise handle a measly Imp or Goblin.<br><br>");
    switch (AmilyScene.amilyPregnancy.pregnancyEventCounter) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5: //Amily is slightly pregnant
            outputText("Amily materializes out of the ruins somewhat slower than usual. You can see that your efforts together have taken; an undeniable bulge pokes out of her midriff, pushing up her tattered shirt slightly and seriously straining her belt. She idly rubs it with one hand, as if confirming its presence to herself.<br><br>");
            //[Low Affection]
            if (gameFlags[AMILY_AFFECTION] < 15 || player.gender == 0) outputText("\"<i>Well, I guess despite whatever other faults you may have, you can get the job done.</i>\" She says, not looking directly at you.<br><br>");
            //[Medium Affection]
            else if (gameFlags[AMILY_AFFECTION] < 40) outputText("\"<i>Thank you. With your help, my people will soon live again.</i>\" She strokes her belly, grinning happily. \"<i>Is there something you want to talk about?</i>\"<br><br>");
            //[High Affection]
            else outputText("\"<i>Thank you, thank you! I couldn't have done this without you!</i>\" She exclaims. \"<i>You've done a wonderful, noble thing, and I'm glad I found you to be their father. So, not that it isn't great to see you again, but why did you come to visit?</i>\"<br><br>");
            break;
        case 6:
        case 7: //Amily is heavily pregnant
            outputText("It takes several minutes before Amily appears, but when you see her, you marvel at how she got to you as quickly as she did. Her stomach is hugely swollen; one of her hands actually cradles underneath its rounded expanse, as if trying to hold it up. She is pants-less, evidently no longer able to fit into them. Her shirt drapes loosely, barely managing to cover the upper half of her firm orb of a belly. The belt where she hangs her blowpipe and dagger has been tied around her upper chest like a sash – between her breasts and her bulge – so she can still carry her weapons effectively.<br><br>");
            //[Low Affection]
            if (gameFlags[AMILY_AFFECTION] < 15 || player.gender == 0) outputText("She seems to be paying more attention to her gravid midriff than to you, and it's several long moments before she finally speaks. \"<i>These children will be born soon. I guess I owe you my thanks for being willing to father them.</i>\"<br><br>");
            //[Medium Affection]
            else if (gameFlags[AMILY_AFFECTION] < 40) outputText("She groans softly. \"<i>This isn't an easy task, you know. But I still want to thank you. Maybe, when these ones are born, you'll be willing to help me make some more?</i>\" She asks, her tail gently waving behind her.<br><br>");
            //[High Affection]
            else outputText("\"<i>I should have known you were coming; they always start kicking up a storm when you're here – did you know that?</i>\" She smiles beatifically. \"<i>They know their daddy already, they do. With your help, a new generation of my people will have a chance to grow up free from the taint of demons. Was there something on your mind?</i>\"<br><br>");
            break;
        default: //Amily is not pregnant
            outputText("It doesn't take long for Amily to materialize out of the ruins. Her blowpipe and dagger are both thrust into her belt, and she's still wearing the same tattered clothes as before.<br><br>");
    }
            // Does Amily treat you cooly? Check for low affection or genderless character...
            if (gameFlags[AMILY_AFFECTION] < 15 || player.gender == 0) {
                // Low affection meeting as a female and you were a female last time means she treats you somewhat nice...
                if (gameFlags[AMILY_MET_AS] == 2 && player.gender == 2) outputText("She crosses her arms and smiles at you. \"<i>So you came back huh?  Did you want to chat with little old me?</i>\" she asks.<br><br>");
                // Otherwise she doesn't trust you.
                else outputText("She crosses her arms and taps her fingers on her shoulder. \"<i>So, why are you here? What do you want?</i>\" she asks.<br><br>");
            }
            // Emily is starting you like you, regardless of gender... AMILY AFFECTION 15-39
            else if (gameFlags[AMILY_AFFECTION] < 40) {
                outputText("She smiles softly upon seeing you. \"<i>It's always good to see somebody else who hasn't given in to corruption. Did you have something on your mind?</i>\"<br><br>");
            }
            // Amily is starting to REALLY like you... AMILY AFFECTION 40+
            // DEBUGGING: player.short returns Undefined. Need to figure out why!
            else {
                outputText("She grins at you with open delight. \"<i>Hey there, " + player.short + "! It's great to see you again... ");
                // If player is male...
                if (player.hasCock()) {
                    outputText("Have you come to knock me up?");
                    if (gameFlags[AMILY_WANG_LENGTH] > 0 && player.pregnancyIncubation == 0) outputText(" Or have you come to get knocked up?");
                } else if (player.hasVagina()) {
                    if (gameFlags[AMILY_WANG_LENGTH] > 0 && player.pregnancyIncubation == 0) outputText("Have you come back so I could stuff another bun in your oven?");
                    else outputText("Did you come back for a little 'quality time' with me?");
                }
                outputText("</i>\" she teases, but her body language ");
                if (gameFlags[AMILY_WANG_LENGTH] > 0) {
                    outputText("and the erection tenting her pants ");
                    // Player gets hot for the mouse cock every time!
                    player.modStats("lus", 5);
                }
                outputText("suggests that it's no joking matter.<br><br>");
            }
            if (gameFlags[AMILY_PC_GENDER] != player.gender) {
                AmilyScene.amilyNewGenderConfrontation();
                return;
            }
            menu();
            gameFlags[AMILY_PC_GENDER] = player.gender;

            // The old method had a flag to force the player to have sex with Amily if a talk-then-sex scene happened regardless of player lust. Changed to force talk and sex to happen only if lust is high enough. Much simpler code.
            if (player.lust > 35) {
                addButton(0, "Sex", AmilyScene.determineAmilySexEvent, null, null, null, "You wanted me to knock you up. Let's do this.");
                addButton(2, "Both", AmilyScene.talkThenSexWithAmily, null, null, null, "Let's spend the day together. A little talking. A little cuddling...");
            }
            addButton(1, "Talk", AmilyScene.talkToAmily, null, null, null, "Actually, I just came for conversation...");
            if (player.hasItem(Items.Consumables.IncubiDraftPurified) && gameFlags[AMILY_WANG_LENGTH] == 0 && gameFlags[AMILY_HERM_QUEST] == 2 && gameFlags[AMILY_AFFECTION] >= 40 && player.gender == 3) {
                addButton(3, "Efficiency", AmilyScene.makeAmilyAHerm, null, null, "Let's make her a herm?");
                outputText("You could probably bring up the efficiency of having two hermaphrodite mothers, particularly since you have this purified incubi draft handy.<br><br>");
            }
            addButton(4, "Leave", Camp.returnToCampUseOneHour);


    }
    ;

// Failsafe function to return player to camp. - COMPLETE
    AmilyScene.amilyMeetingFailed = function () {
        outputText("You shouldn't have reached this failsafe message. Printing default message and allowing return to camp.<br><br>");

        outputText("You enter the ruined village cautiously. There are burnt-down houses, smashed-in doorways, ripped-off roofs... everything is covered with dust and grime. You explore for an hour, but you cannot find any sign of another living being, or anything of value. The occasional footprint from an imp or a goblin turns up in the dirt, but you don't see any of the creatures themselves. It looks like time and passing demons have stripped the place bare since it was originally abandoned. Finally, you give up and leave. You feel much easier when you're outside of the village – you had the strangest sensation of being watched while you were in there.");
        doNext(Camp.returnToCampUseOneHour);
    };
//MALE MEETINGS AFTER INITIAL REJECTION

// Male PC rejected Amily's offer, meets her again - NEED SPRITE IMAGE TO FINISH
    AmilyScene.amilyRemeetingContinued = function () {
        clearOutput();

        outputText("\"<i>So, have you changed your mind? Have you come to help me out?</i>\" Amily asks curiously.<br><br>");
        menu();
        addButton(0, "Accept", AmilyScene.secondTimeAmilyOfferedAccepted, null, null, null, "Tooltip to be added.");
        addButton(1, "Refuse", AmilyScene.secondTimeAmilyRefuseAgain, null, null, null, "Tooltip to be added.");
        addButton(2, "Just Talk", AmilyScene.repeatAmilyTalk, null, null, null, "Tooltip to be added.");
        addButton(3, "Get Lost", AmilyScene.tellAmilyToGetLost, null, null, null, "Tooltip to be added");
        // There's a straight-up leave option here in the code, but it doesn't make much sense story-wise to leave without answering the question.

    };

// Accept offer the second time, move to sex loops. - NEED SPRITE IMAGE TO FINISH
    AmilyScene.secondTimeAmilyOfferedAccepted = function () {
        clearOutput();

        outputText("You tell her that, yes – you'll give her the children she wants. She smiles pleasantly and tells you to follow her.<br><br>");
        //Offer accepted
        gameFlags[AMILY_OFFER_ACCEPTED] = 1;
        doNext(AmilyScene.amilySexHappens);
    };

// Refuse offer politely a second time. No affection boost. No change to the encounters. - NEED SPRITE IMAGE TO FINISH
    AmilyScene.secondTimeAmilyRefuseAgain = function () {
        clearOutput();

        outputText("You shake your head gently and explain that your position has not changed. Amily looks annoyed, but respects your decision.<br><br>");

        outputText("\"<i>All right; it is your choice. But my offer still stands, you know,</i>\" she tells you.<br><br>");

        outputText("You let her know you'll remember that, and then turn and leave.");
        doNext(Camp.returnToCampUseOneHour);
    };

// Talking to Amily again after offer refusal - NEED SPRITE IMAGE TO FINISH
    AmilyScene.repeatAmilyTalk = function () {
        clearOutput();

        outputText("You tell her that you only wanted to talk.<br><br>");
        outputText("\"<i>Just to talk?</i>\" Amily asks, and then adds quietly, \"<i>Well... it has been a long time since I actually had somebody to talk to...</i>\" She looks distracted for a moment, but then she smiles. Clearly, Amily is pleased with the prospect. \"<i>So, is there anything in particular you want to talk about?</i>\"<br><br>");
        doNext(AmilyScene.amilyConversationStart);
    };

// This text needs updating. Looks like it was originally going to shut out the whole ruins, but there could still be racks and/or Shouldra encounters the player would want to encounter. Leaving text as is for now.
// Shuts off Amily encounters
    AmilyScene.tellAmilyToGetLost = function () {

        outputText("You jeer at Amily that you have no interest in a hypocrite who claims to be pure but is really just like everything else in this tainted world; no higher purpose other than her next fuck.<br><br>");

        outputText("Amily goes red with rage. \"<i>Why you arrogant, puffed-up, pigheaded...!</i>\" She's livid! \"<i>The demons'll have you – see if they don't! I don't need you – you're probably infertile anyway, you—</i>\" She trails off into a stream of the most perverse profanity you have ever heard, and then runs off into the ruins.<br><br>");

        outputText("You spin on your heel and stalk off. You figure that she will go out of her way to avoid you in the future; there's no point coming back here.");
        //{Amily can no longer be encountered}
        gameFlags[AMILY_VILLAGE_ENCOUNTERS_DISABLED] = 1;
        doNext(Camp.returnToCampUseOneHour);
    };

// IF MALE OFFER IS ACCEPTED FIRST TIME

// Male PC accepts Amily's offer eagerly. (Consider changing this response to Lusty. It's a bit beyond eager...) - NEED SPRITE IMAGE TO FINISH
    AmilyScene.acceptAmilysOfferEagerly = function () {
        clearOutput();
        menu();

        outputText("You grin lecherously, unable to help it. It's rare when someone in this world wants to fuck and actually asks you, rather than just trying to beat you senseless and then rape you. You tell Amily that if she wants you to fuck her, you'll be happy to do so.<br><br>");

        outputText("The mouse-woman looks appalled. \"<i>Must you be so vulgar?</i>\" she complains.<br><br>");

        outputText("You tell her that this is precisely what she's asking you to do, and you'll be happy to do so if that is what she wants.<br><br>");

        outputText("She still looks disgruntled. \"<i>Very well, come on. I suppose it was too much to hope that you would be roaming this world and yet still have some decorum when it comes to sex...</i>\" She begins leading the way and you follow. She doesn't have much of a butt to stare at, but you can already think of some interesting things to do with that tail of hers...<br><br>");

        outputText("Your brash enthusiasm has made Amily uncomfortable, and your quick surrender to baser impulses has made you slightly more lustful.");
        //Offer accepted
        gameFlags[AMILY_OFFER_ACCEPTED] = 1;
        //-5 Amily Affection for your rudeness
        gameFlags[AMILY_AFFECTION] -= 5;
        //+5 Libido
        player.modStats("lib", 5);
        //[/ Go to [First Time Sex]]
        doNext(AmilyScene.amilySexHappens);

    };
// Male PC accepts Amily's offer hesitantly. - NEED SPRITE IMAGE TO FINISH
    AmilyScene.acceptAmilysOfferHesitantly = function () {
        clearOutput();
        menu();

        outputText("The offer is shocking... and yet, strangely enticing. You cannot help but think that it's nice to meet somebody who, even if they are more sexually explicit than in your village, actually approaches the matter with some decorum. You are still surprised and even embarrassed by the invitation, but you can't help but think it might be worthwhile to accept. It's for a good cause, and she's clearly not entirely comfortable with it herself. Maybe you've been too long in this world of beast-people and monsters, but she actually is kind of cute.<br><br>");

        outputText("Softly, you ask if she really does want you to mate with her, to father her offspring.<br><br>");

        outputText("\"<i>Yes. You're the best hope I have... the only hope I have.</i>\" She replies, sadly.<br><br>");

        outputText("You bow your head and tell her that if she really does need your help, you will help her – even if it does mean doing things with her that she doesn't want.<br><br>");

        outputText("She blinks at you, clearly surprised. \"<i>I've never met a male who actually cared if a female wanted sex or not...</i>\" She then smiles gently. \"<i>It's nice to meet somebody who can still care about people as something other than fuck toys. Please, come with me.</i>\"<br><br>");

        outputText("She eagerly leads you down a path, her tail swishing back and forth energetically. She seems very happy by your acceptance.<br><br>");

        outputText("It seems you've made Amily happy by asking if this is what she wants.");
        //Offer accepted
        gameFlags[AMILY_OFFER_ACCEPTED] = 1;
        //{+5 Affection}
        gameFlags[AMILY_AFFECTION] += 5;
        //[/ Go to [First Time Sex]]
        doNext(AmilyScene.amilySexHappens);

    };
// Refuse Amily's Offer. Impress her! - NEED SPRITE IMAGE TO FINISH
    AmilyScene.refuseAmilysOffer = function () {
        clearOutput();
        menu();

        outputText("You shake your head in refusal.<br><br>");

        outputText("Amily stares at you in disbelief. \"<i>No? What do you mean, no? I'm honestly offering to have sex with you here.</i>\"<br><br>");

        outputText("You tell her that you can't simply have sex with some stranger who you have never met before, especially when that stranger admits it would just be a casual, unfeeling, emotionally hollow act. You dread the idea of simply whoring yourself out, even for an evidently noble cause as this - it's just not right. You came to this world to try and fight the hedonism and lechery that the demons represent, not to support it or, worse, give in to it yourself.<br><br>");

        outputText("Amily is wide-eyed when you finish. \"<i>I have... I haven't heard anybody say things like that, think like that, in a long time.</i>\" She smiles, faintly, then fiercely shakes her head. \"<i>I really do need your help... but I can only respect your conviction. I do hope that we can come to terms later, though.</i>\"<br><br>");

        outputText("She gives you a bow and then leaves, giving you the chance to turn around and leave this ruined village yourself.<br><br>");

        outputText("You have impressed Amily considerably, and reigning in your sexual impulses has helped to calm your libido.<br><br>");
        // +10 Affection. Behold the power of NoFap!
        gameFlags[AMILY_AFFECTION] += 10;
        // -5 Libido for avoiding obvious offer.
        player.modStats("lib", -5);
        doNext(Camp.returnToCampUseOneHour);
    };
// Refuse Amily because she's a mouse and mice are gross. - NEED SPRITE IMAGE TO FINISH
    AmilyScene.amilyNoFur = function () {
        clearOutput();
        menu();

        gameFlags[AMILY_OFFERED_DEFURRY] = 1;
        outputText("You shake your head gently and explain that your position has not changed. Amily looks annoyed, but respects your decision.  You interrupt her next thought with a clarification; you don't want to have sex with her because of her appearance.  \"<i>...What do you mean?</i>\" she asks, one of her hands idly moving up and tugging one of her mousey ears.  As gently as you can, you explain that mice (and rats, for that matter) are considered pests in your home world, and you can't find yourself inclined to mate with a walking version of them.<br><br>");

        outputText("There's a long pause while Amily digests your implication.  \"<i>You want me to... change?</i>\" she asks quietly.  \"<i>Would that... make you want to mate with me?</i>\"  You can't make any promises, but it would definitely change your considerations, you explain.<br><br>");

        outputText("After another long silence, she sighs.  \"<i>I don't know.  What would my family say if I just... went and made myself a completely different person, all for the sake of a human?</i>\"  You slowly move to her and lay a hand on her shoulder, forcing her to look once more into your eyes.  It's not the fact that she won't be a mouse, you insist.  It's the fact that she's moving on for the sake of her race.  She manages a little smile at that, her expression brightening just a bit.  \"<i>I'll think about it,</i>\" she finally decides.  \"<i>If you can find some non-demonic reagents, perhaps we can give it a try.  If anything bad happens, though,</i>\" she warns, wagging a finger at you threateningly.  She backs off and stands awkwardly for a second.<br><br>");

        outputText("\"<i>Well, uh... bye,</i>\" Amily concludes, whirling around and walking away.  You can't be sure, but it seems like she's exaggerating the sway of her hips a bit.  You don't think much of it, heading back toward camp and beginning to formulate a concoction to de-mouse your potential breeding partner.  Perhaps... a <b>golden seed</b> for a human face, a <b>black egg</b> to get rid of the fur, and some <b>purified succubus milk</b> to round things off.  You make a mental note to remember those ingredients, for they won't show up again and you'd feel positively silly if you somehow completely forgot them.<br><br>");
        doNext(Camp.returnToCampUseOneHour);
    };
//MALE DESPERATE AMILY ENCOUNTERS

//Accept Amily Desperate Plea - NEED SPRITE IMAGE TO FINISH
    AmilyScene.desperateAmilyPleaAcceptHer = function () {
        clearOutput();

        //set accepted flag
        gameFlags[AMILY_OFFER_ACCEPTED] = 1;
        outputText("With a gentle smile, you reach out and take hold of her hand. You tell her that you do like her too; you just wanted to know her as a person before you would take something as precious to her as her virginity. If she still wants you, then you want to go with her now.<br><br>");

        outputText("Amily stares at you, stunned. After a moment, she embraces you fiercely and begins to drag you away.<br><br>");

        doNext(AmilyScene.amilySexHappens);
    };

//Let Amily Down Gently, shuts off her encounters - NEED SPRITE AND TEL'ADRE to finish
    AmilyScene.desperateAmilyPleaTurnDown = function () {
        clearOutput();

        outputText("You softly tell her that you're sorry, but it just can't be helped. You have a quest to fulfill, and you don't even know if you'll be staying around instead of going home when it's over. That's even assuming you succeed, and don't end up dead in a ditch somewhere. You can't countenance taking a lover with something like that hanging over your head. Besides, you tell Amily that she should have more respect for her body than what this plan of hers entails, anyway.<br><br>");
        outputText("Amily sniffs loudly, tears blatantly running down her cheeks. \"<i>If... if that's the way it has to be, then,</i>\" she sniffles, \"<i>I... I guess that there's nothing left for me here. I'll just have to leave... Maybe I can find somewhere that will at least give me shelter.</i>\"<br><br>");
        //[Player has found Tel'Adre]
        // UNCOMMENT AFTER TEL'ADRE FLAGS ARE SET
        /*
         if (player.statusEffectv1(StatusEffects.TelAdre) >= 1) {
         outputText("You tell her that you've discovered a hidden city in the desert, free of corruption. Amily looks shocked, but clearly grateful as you assure her of its existence and provide instructions on how to get there.<br><br>");
         }
         else {
         outputText("Looking dejected, Amily slowly begins to walk away. However, just before she makes her final turn to disappear, she turns back to you. \"<i>I'll always remember you,</i>\" she promises sincerely – and then she is gone.<br><br>");
         }
         */
        outputText("Feeling the weight of the empty village pressing in on you, you quickly retreat yourself. There's no point coming back here.");
        //turn off village.
        gameFlags[AMILY_VILLAGE_ENCOUNTERS_DISABLED] = 1;
        doNext(Camp.returnToCampUseOneHour);
    };

//Be an ass and turn her down bluntly- NEED SPRITE IMAGE TO FINISH
    AmilyScene.desperateAmilyPleaTurnDownBlunt = function () {

        clearOutput();
        outputText("Without mercy or hesitation, you tell her that there is indeed something wrong with her: You could never be attracted to a woman that looks like a pest and should be hiding in a granary.<br><br>");

        outputText("\"<i>Why you-! I bare my soul to you, and this is how you repay me?!</i>\" Amily screams; rage, hurt and betrayal are all evident in her words.<br><br>");

        outputText("You jeer at her that it's not your fault that she's so pathetic, falling for the first person to take pity on her and talk to her.<br><br>");

        outputText("Amily responds by spitting a stream of the most jarringly foul language at you. In her rage, she hurls a blowpipe dart at you with her hands, which you easily swat aside. Cursing all the while, she races off in a fury.<br><br>");

        outputText("You know she's never going to come back.");
        //Player gains corruption}
        player.modStats("cor", 1);
        //{Amily can no longer be encountered}
        gameFlags[AMILY_VILLAGE_ENCOUNTERS_DISABLED] = 1;
        //{Ruined Village removed from Places list}
        doNext(Camp.returnToCampUseOneHour);
    };

//FEMALE AMILY ENCOUNTERS

//Lesbian Love Confession:- NEED SPRITE IMAGE TO FINISH

    AmilyScene.amilyLesbian = function () {

        clearOutput();
        outputText("Strangely, you don't need to seek Amily out this time; she's waiting for you. You ask her if something is wrong, and she shakes her head... but she looks kind of embarrassed as she does so.<br><br>");

        outputText("\"<i>There's... ah... something I want to talk about with you, " + player.short + ",</i>\" She finally says. \"<i>I... Well, I've never really thought of other women as being attractive before, and maybe it's just because I've been alone so long, but you've been so kind to me and it's so nice to have somebody who cares for me and well I guess what I want to say is -</i>\"<br><br>");

        outputText("You interject, telling her to slow down and breathe, you're not going anywhere. Amily pants, then finally squeaks out, \"<i>I'm in love with you!</i>\" before her face turns bright red. Stunned, you ask her to repeat that. \"<i>I said... I'm in love with you. I... ah, forget it, who was I kidding?</i>\" She trails off, sadly, and you watch as she begins to turn around and shuffle off.");
        //Set flag that she's confessed her lesbo-live!
        gameFlags[AMILY_CONFESSED_LESBIAN] = 1;
        menu();
        addButton(0, "Stop Her", AmilyScene.amilyLesbianStopHer, null, null, null, "Tooltip added later.");
        addButton(1, "Let Her Go", AmilyScene.amilyLesbianLetHerGo, null, null, null, "Tooltip added later.");
    };

// Admit you want Lesbian Mouse Lovin
    AmilyScene.amilyLesbianStopHer = function () {

        clearOutput();
        outputText("Before she can get too far, though, your hand shoots out and clasps her shoulder. She starts to question what you're doing, but you spin her around and pull her into a tight embrace, telling her that you feel the same way. Shyly, she offers her lips to you, and you kiss them eagerly. When you seperate for breath, you ask if she wants to see what it's like with another woman. Her eyes glazed, she nods at you wordlessly and starts leading you away down the street.<br><br>");
        //WHAT THE FUCK DOES THIS SCENE LEAD TO?
        gameFlags[AMILY_CONFESSED_LESBIAN] = 2;
        doNext(AmilyScene.girlyGirlMouseSex);
    };

// Deny the Mousie Lesbian Mouse Lovin. Old comment in here about you having other relationships and shutting off her encounter.
// - NEED URTA AND MARBLE TO FINISH
    AmilyScene.amilyLesbianLetHerGo = function () {

        clearOutput();
        /*(If player is already locked into a relationship):
         if (player.hasStatusEffect(StatusEffects.CampMarble) >= 0 || urtaLove()) {
         outputText("You put a hand on her shoulder, bringing her to a stop. She looks so hopeful at you that it's almost painful, but you tell her that, while you do care for her and you like her as a friend, you're already in a relationship with somebody.<br><br>");

         outputText("\"<i>Are you? ...I see. Well, I'm happy that you, at least, found somebody. I... You're still welcome to come by and talk, but I'll respect your wishes.</i>\" Amily tells you. Evidently still quite embarrassed, she apologises and then melts away into the ruins again.");
         //(Amily is now locked out of a relationship with the player)
         }*/
        outputText("You watch her go, feeling a little guilty, but you just don't swing that way. You can only hope she'll be all right.<br><br>");
        //(Amily's affection drops back down to Low)
        if (gameFlags[AMILY_AFFECTION] > 10) gameFlags[AMILY_AFFECTION] = 10;
        doNext(Camp.returnToCampUseOneHour);
    };

// HERM PLAYER ENCOUNTERS

// Make Amily a Herm for dual pregnancy action. - NEED SPRITE IMAGE AND PREGNANCY EVENTS AND ITEM CONSUMPTION TO FINISH
    AmilyScene.makeAmilyAHerm = function () {

        clearOutput();
        outputText("You talk to Amily about how she and you have grown to know each other well, so well that she has been willing to have sex with you despite her aversion to hermaphrodites.<br><br>");

        outputText("\"<i>That's true... I... I can't say I can understand what life must be like for you like that.</i>\" She admits.<br><br>");

        outputText("You ask if she would be willing to try and see your view on things - you happen to have a vial of Incubus Draft from which the tainting elements have been removed.<br><br>");

        outputText("She looks very nervous. \"<i>I... I mean... I don't really want to do that.</i>\"<br><br>");

        outputText("You point out that it would be for the best for her plans; this way, the two of you will be able to bear litters simultaneously, so she can have children even faster and in greater numbers than before. Giving her a winning smile, you clasp hold of her hands gently and ask if she'll please consider doing it; for you?<br><br>");

        outputText("Amily looks crestfallen, then finally nods her head, slowly. \"<i>I... I'm not really sure about this, but... if it's for you, " + player.short + ", then... I'll do it.</i>\" She takes the vial, staring at it apprehensively, then pops the cork and swallows it down quickly in a single gulp. She shudders - first in disgust at what she actually drank, then with pleasure. Moaning ecstatically, she " + (AmilyScene.amilyPregnancy.pregnancyEventCounter >= 6 ? "lifts her shirt" : "pulls off her pants") + " to give you a full view as her clitoris swells, longer and thicker; finally, skin peels back at the tip to reveal what is unmistakably the glans of a penis, complete with a cum-gouting slit as she experiences her first male orgasm.<br><br>");

        outputText("Amily is now a hermaphrodite. Her human-like penis is four inches long and one inch thick.<br><br>");


         outputText("Catching her breath, she " + (AmilyScene.amilyPregnancy.pregnancyEventCounter >= 6 ? "tries to get a look at her new member over her bulging belly. When that fails she runs her hand over it, touching it carefully while maintaining an unreadable expression. Then she stares at you and says, " : "stares at her new appendage with an unreadable expression, then she stares at you.") + " \"<i>Well, now I've got a penis... so that means you're coming with me to let me try it out!</i>\"<br><br>");


        outputText("You agree  and allow her to begin leading you to the \"<i>bedroom</i>\".");
        gameFlags[AMILY_WANG_LENGTH] = 4;
        gameFlags[AMILY_WANG_GIRTH] = 1;
        //player.consumeItem(Items.Consumables.IncubiDraftPurified); Need to figure out how to make this work.
        menu();
        //[Herm Amily on Female PC, First Time, scene plays]
        doNext(AmilyScene.amilyHermOnFemalePC);
    };

// Question dislike of herms.
    AmilyScene.whyNotHerms = function () {

        clearOutput();
        outputText("As you head into the ruined village to find Amily, your thoughts drift yet again to the strange conundrum that has been puzzling you. You haven't failed to realize that Amily initially seemed to want to talk to you about her plans for reviving her people, but after realizing your bi-gendered nature, she insists on dropping the subject if it ever comes up.<br><br>");

        outputText("You are so intent on asking her why it is that she doesn't want to talk about it that you almost walk into her.");

        outputText("\"<i>You looked deep in thought; what's the matter?</i>\" She asks.<br><br>");

        outputText("You remind her of how, when you first met, she spoke of her having to take \"<i>a role</i>\" in freeing her people, and how she was about to ask you for help, but she stopped when she realized you were a hermaphrodite.<br><br>");

        outputText("Amily looks at the ground, scuffing it idly with one pink claw. \"<i>I did, yes... The role? Well, I've been forced to realize that there just aren't any of my people left in freedom - they're all dead or slaves to the demons. If there are any out there, they're too far away for it to make any difference to me. So, I came to the decision; if I am the last of the free mice in this land, then I must take whatever steps are neccessary to restore my people. Even if it means becoming the mother of a whole new generation of them.</i>\"<br><br>");

        outputText("You ask if that is why she was particularly interested in you being human.<br><br>");

        outputText("\"<i>Yes. I've heard that humans are both inherently pure and very weak-seeded; if I could find a human man before the demons caught him, he would be the perfect mate to help me with that goal, because the children he fathered on me would be pure in both senses.</i>\"<br><br>");

        outputText("Crossing your arms, you sarcastically ask what you are; chopped liver?<br><br>");

        outputText("Amily stands up and does her best to look you in the eyes, crossing her arms as well. \"<i>You're not a man - you're a hermaphrodite. I can't lie with you - what if the babies inherit that trait?</i>\"<br><br>");

        outputText("You ask if that wouldn't be an advantageous trait, allowing each individual to both impregnate and be impregnated and letting their population swell all the faster.<br><br>");

        outputText("\"<i>But it's unnatural!</i>\" She barks... well, squeaks indignantly, anyway. \"<i>Women with cocks, men with cunts - before those fucking demons, you never saw creatures like that! They're not normal! I mean, you don't seem to be a bad person, but I could never have sex with someone like that!</i>\"<br><br>");

        outputText("At that, she turns and runs off, quickly vanishing into the rubble. You choose not to pursue; it seems she's clearly not in the mood to talk about it.<br><br>");
        gameFlags[AMILY_HERM_QUEST]++;
        doNext(Camp.returnToCampUseOneHour);
    };

//"Maybe Herms Aren't So Bad":
    AmilyScene.hermRenegotiate = function () {

        clearOutput();
        outputText("Yet again, you find yourself wandering through the ruined village where Amily stalks. Not entirely sure if you want to speak to her, you turn and are about to leave when you hear the sound of a rock plinking off of a wall. Looking around, you find Amily has joined you, looking apologetic.<br><br>");

        outputText("\"<i>I... I want to say that I'm sorry. I was a real asshole, in that conversation, but... I've seen so many others mutated into herms to become mindless fucktoys, or who could only think about sex after they became herms. I've never met somebody who had two genders and could think about anything besides pussy and dick... until I met you, anyway.</i>\"<br><br>");

        outputText("She pointedly looks away from you, blushing slightly. \"<i>I've been thinking, about things. About us. And... well, even if you are a herm, you've been the only friend I've had in years. If you can find it in your heart to forgive me... I'd like you to be the father of my children.</i>\" She stares at you, eyes wide and hopeful. \"<i>What do you say?</i>\"<br><br>");
        menu();
        addButton(0, "Yes", AmilyScene.amilyAgreeHerm, null, null, null, "Add Tooltip Later.");
        addButton(1, "No", AmilyScene.amilyRejectHerm, null, null, null, "Add Tooltip Later.");
        if (gameFlags[AMILY_NOT_FURRY] == 0)
            addButton(2, "No Furries", null, null, null, "Add Tooltip Later.");

    };

// Agree to Amily's hermneess.
    AmilyScene.amilyAgreeHerm = function () {

        clearOutput();
        gameFlags[AMILY_HERM_QUEST] = 2;
        outputText("You tell her that you'll forgive her, and you will help her breed the " + ((gameFlags[AMILY_NOT_FURRY] == 0) ? "free mousemorphs that she wants so badly. She looks a bit confused by you using the term 'mouse-morphs', but otherwise seems happy." : "") + " \"<i>Wonderful! Come with me!</i>\" She says, grabbing your hand and pulling you down the street.<br><br>");
        //(Play out "First Sex" scene, with whatever tweaks are needed to account for the PC's hermaphroditic nature.)
        doNext(AmilyScene.amilySexHappens);
    };

// Reject Amily's Hermness
    AmilyScene.amilyRejectHerm = function () {

        clearOutput();
        outputText("You scoff at her, and tell her that she called you a freak of nature, an unnatural demon-crafted thing. You have no interest in having sex with somebody who thinks of you as some kind of breeding toy.<br><br>");

        outputText("Amily winces, looking deeply hurt. \"<i>I... You're right, what I said was unforgivable. I... think it's best that we part ways.</i>\"<br><br>");

        outputText("Looking deeply sad, she turns and walks away, vanishing into the urban wilderness in that way only she can. Instinctively, you realize that you will never see her again.");
        gameFlags[AMILY_VILLAGE_ENCOUNTERS_DISABLED] = 1;
        doNext(Camp.returnToCampUseOneHour);
    };

// CHANGED GENDER RESPONSES

// NEEDS LOTS OF TESTING. NEED TO BUILD GENDER CHANGE DEBUGGING TOOL AT CAMP.
    AmilyScene.amilyNewGenderConfrontation = function () {

        clearOutput();
        var sex = null;
        //Remember old gender.
        var oldGender = gameFlags[AMILY_PC_GENDER];
        //Re-init old gender so we don't get caught in a loop!
        gameFlags[AMILY_PC_GENDER] = player.gender;
        //Called from mid-way through remeeting's intro!
        outputText("Suddenly, Amily stops and looks puzzled, her nose twitching. \"<i>Have you changed...? Yes, you have! You've been messing with some of those weird potions and things that show up here and there - you've altered your gender, haven't you?</i>\"<br><br>");

        outputText("You nod your head and admit you have.<br><br>");
        //Started as male...
        if (oldGender == 1) {
            //...Now Female
            if (player.gender == 2) {
                //Low Affection:
                if (gameFlags[AMILY_AFFECTION] < 15) {
                    outputText("\"<i>Oh, great. Now what am I going to do with you? Why on earth would you stuff this up?</i>\" Amily complains. She shakes her head. \"<i>Come back later - I'm too frustrated to talk to you now.</i>\" She storms away and you decide it would be best to take her advice.<br><br>");
                    //(Player must now begin the Female Quest from the beginning.)
                }
                //Medium Affection:
                else if (gameFlags[AMILY_AFFECTION] < 40) {
                    outputText("\"<i>I... I... why would you do that?</i>\" Amily asks, looking hurt. \"<i>I... no, This wasn't an effort by you to hurt me, I'm sorry, I was being selfish.</i>\" She apologizes. \"<i>But... I don't know what we can do any more. I... I need time to think.</i>\" She turns and walks away, and you decide to give her what she asks for.");
                    //(When next the PC encounters Amily, they will receive the "confession of love" scene.)
                }
                //High Affection:
                else {
                    outputText("Amily looks quite upset, and then her expression changes to one of resolve. \"<i>I won't pretend to know how this happened, or to understand why you would do this voluntarily, if that was the case, but you mean too much to me to let you go over something like this.</i>\" She seizes hold of your hand, fiercely, and starts determinedly pulling you along. \"<i>Come with me!</i>\" She orders.");
                    //(Amily Yuri sex scene plays.)
                    doNext(AmilyScene.girlyGirlMouseSex);
                    return;
                }
            }
            //...Now Herm
            else if (player.gender == 3) {
                //Low Affection:
                if (gameFlags[AMILY_AFFECTION] < 15) {
                    outputText("\"<i>...Are you a herm, now?</i>\" She asks, sounding appalled. When you confirm it, she grimaces in disgust. \"<i>Stay away from me! You're not coming near my bed again until you're all man again!</i>\" She orders, and then storms off.<br><br>");
                    //(Player must now begin the Herm Quest from the beginning.)
                }
                //Medium Affection:
                else if (gameFlags[AMILY_AFFECTION] < 40) {
                    outputText("She looks intimidated. \"<i>I... I'm sorry, but I don't think I can share my bed with you, not any more. Please, find a way to become male again, then come back to me?</i>\" She pleads, then slips away.<br><br>");
                    //(Amily's affection score remains unchanged, but the player must make the "What's Wrong With Herms" scene.)
                }
                //High Affection:
                else {
                    outputText("\"<i>I...</i>\" She swallows hard. \"<i>This is a great shock, I must confess, but... But I care too much to lose you. I don't care if you've got a pussy of your own, now. I still want to be with you.</i>\" She smiles at you, feebly. \"<i>So, as I was saying, what do you want to talk about?</i>\"<br><br>");
                    //(The player is considered as having completed the herm-specific part of Amily's quest.)
                    gameFlags[AMILY_HERM_QUEST] = 2;
                }
            }
            //...Now Genderless ( I think this needs to be separated out completely to its own space.)
            else {
                //Low Affection:
                if (gameFlags[AMILY_AFFECTION] < 15) {
                    outputText("She looks at you in disdain. \"<i>How can you be so stupid as to completely remove all gender from yourself? Get out of my sight and don't come back until you're one gender or the other again!</i>\" She then proceeds to storm off.<br><br>");
                    //(Amily will repeat this scene on each remeeting until the player becomes a gender other than Genderless.)
                }
                else if (gameFlags[AMILY_AFFECTION] < 40) {
                    outputText("She shakes her head sadly. \"<i>I guess this kind of puts a kink in our relationship, doesn't it? Still, I'll always be willing to talk with you.</i>\"<br><br>");
                    //(The player can only Talk with Amily on each remeeting until they have become a gender other than Genderless.)
                }
                //High Affection:
                else {
                    outputText("She looks upset and concerned - but for your sake, not hers. \"<i>I can't imagine what catastrophe robbed you like this. Please, find a way to change yourself back? Man, woman, even herm, I can't bear to see you like this... but I'll give you all the support I can.</i>\"<br><br>");
                    //(The player can only Talk with Amily on each remeeting until they have become a gender other than Genderless.)
                }
            }
        }
        //[Female...
        else if (oldGender == 2) {
            // to Male]
            if (player.gender == 1) {
                //Low Affection:
                if (gameFlags[AMILY_AFFECTION] < 15) {
                    outputText("Amily looks deeply surprised. \"<i>You... you turned yourself from a woman into a man? ...For me?</i>\" She scuffs her foot at the ground in embarrassment. \"<i>I... I don't know what to say. But... will you hear me out, now that you have changed?</i>\"<br><br>");
                    //(Begin Male variant of Amily's quest.)
                    //FEN: Increase affection!
                    gameFlags[AMILY_AFFECTION] += 15;
                    //FEN: If PC has had any kids with her, set as good to go!
                    if (gameFlags[PC_TIMES_BIRTHED_AMILYKIDS] > 0) gameFlags[AMILY_OFFER_ACCEPTED] = 1;
                }
                //Medium Affection:
                else if (gameFlags[AMILY_AFFECTION] < 40) {
                    outputText("She looks surprised, unsure of what to say. \"<i>I... thank you. I do feel we've grown closer, but this will make things much easier...</i>\"");
                    //(Begin Male variant of Amily's quest.)
                    //FEN: Increase affection!
                    gameFlags[AMILY_AFFECTION] += 5;
                    //FEN: If PC has had any kids with her, set as good to go!
                    if (gameFlags[PC_TIMES_BIRTHED_AMILYKIDS] > 0) gameFlags[AMILY_OFFER_ACCEPTED] = 1;
                }
                //High Affection:
                else {
                    outputText("She looks pleased, but then adopts an exaggerated expression of irritation. \"<i>You go to all the hard work of seducing me as a woman, and now you turn into a man? Why do you put me through these things?</i>\" She heaves a similarly exaggerated sigh, then smiles again. \"<i>Ah, well, now we can start things over, can't we? Let's see what the new you is like in bed.</i>\" She makes a 'come hither' expression, then playfully starts running off into the ruins, making sure you follow her.<br><br>");
                    //mark as agreed to preg-quest!
                    gameFlags[AMILY_OFFER_ACCEPTED] = 1;
                    //(Play High Affection Male sex scene.)
                    doNext(AmilyScene.amilySexHappens);
                    return;
                }
            }
            //[Female to Herm]
            else if (player.gender == 3) {
                //Amily has no dick.
                if (gameFlags[AMILY_WANG_LENGTH] == 0) {
                    //Low Affection:
                    if (gameFlags[AMILY_AFFECTION] < 15) {
                        outputText("She looks at you for a long time, then shakes her head in disbelief. \"<i>What woman in her right mind would grow a dick? Ah, well, get rid of the pussy, and then you and I may have something to talk about. But, for now, we'll just talk.</i>\"");
                        //(Begin herm variant of Amily's quest.)
                    }
                    //Medium Affection:
                    else if (gameFlags[AMILY_AFFECTION] < 40) {
                        outputText("\"<i>I... don't take this the wrong way, " + player.short + ", but... I'm not so sure we can be together any more while you have that. Be one thing or the other, not both.</i>\" Amily states. \"<i>But we can still talk, this time.</i>\"");
                        //(Next encounter with Amily is the "Maybe Herms Aren't So Bad" scenes.)
                    }
                    //High Affection:
                    else {
                        outputText("She looks you up and down, swallows forcefully, then looks determined. \"<i>I... I never dreamed I would say this to a hermaphrodite, but... but I know you, and I love you. If you still want to be with me, I'll stay with you.</i>\" She gives you wry grin. \"<i>Besides, I guess this means that now you and I can have children, anyway.</i>\"");
                        //(Player counts as having finished the herm variant of Amily's quest.)
                        gameFlags[AMILY_HERM_QUEST] = 2;
                    }
                }
                //Amily grew a dick for you.
                else {
                    outputText("Amily looks you up and down, blushes and says, \"<i>Did you get a little jealous of me and decide to have some fun for yourself?  I-I didn't want it to be this way, but I guess we can both repopulate my race now.  How wonderful.</i>\"");
                    gameFlags[AMILY_HERM_QUEST] = 2;

                }
            }
            //[Any to Genderless]
            else {
                //Low Affection:
                if (gameFlags[AMILY_AFFECTION] < 15) {
                    outputText("She looks at you in disdain. \"<i>How can you be so stupid as to completely remove all gender from yourself? Get out of my sight and don't come back until you're one gender or the other again!</i>\" She then proceeds to storm off.<br><br>");
                    //(Amily will repeat this scene on each remeeting until the player becomes a gender other than Genderless.)
                }
                else if (gameFlags[AMILY_AFFECTION] < 40) {
                    outputText("She shakes her head sadly. \"<i>I guess this kind of puts a kink in our relationship, doesn't it? Still, I'll always be willing to talk with you.</i>\"<br><br>");
                    //(The player can only Talk with Amily on each remeeting until they have become a gender other than Genderless.)
                }
                //High Affection:
                else {
                    outputText("She looks upset and concerned - but for your sake, not hers. \"<i>I can't imagine what catastrophe robbed you like this. Please, find a way to change yourself back? Man, woman, even herm, I can't bear to see you like this... but I'll give you all the support I can.</i>\"<br><br>");
                    //(The player can only Talk with Amily on each remeeting until they have become a gender other than Genderless.)
                }
            }
        }
        //Herm toooooooo
        else if (oldGender == 3) {
            //[Herm to Male]
            if (player.gender == 1) {
                //Low Affection:
                if (gameFlags[AMILY_AFFECTION] < 15) {
                    outputText("She looks you over and smiles. \"<i>Well, now that's more like it. You and I, we need to talk...</i>\"");
                    //(Begin the male variant of Amily's quest, +5 affection.)
                    gameFlags[AMILY_AFFECTION] += 5;
                    //if engaged in herm-quest autoenable male quest!
                    if (gameFlags[AMILY_HERM_QUEST] == 2) gameFlags[AMILY_OFFER_ACCEPTED] = 1;
                }
                //Medium Affection:
                else if (gameFlags[AMILY_AFFECTION] < 40) {
                    outputText("\"<i>And here I was starting to get used to you like that... but I'm happy you made such a change for me.</i>\" She tells you, smiling.<br><br>");
                    gameFlags[AMILY_AFFECTION] += 2;
                    //mark as agreed to preg-quest!
                    gameFlags[AMILY_OFFER_ACCEPTED] = 1;
                    //(Use the Remeeting scene options.)
                    if (player.lust >= 33) AmilyScene.sexWithAmily();
                    else {

                        // ADD BUTTONS
                        //if (sex != null) simpleChoices("Sex", sex, "Talk", talkToAmily, "Both", talkThenSexWithAmily, "", null, "", null);
                        //		else simpleChoices("", null, "Talk", talkToAmily, "", null, "", null, "", null);
                        doNext(Camp.doCamp);
                    }

                }
                //High Affection:
                else {
                    outputText("\"<i>I was comfortable with who you were, you didn't have to change on my account...</i>\" Amily says, clearly looking guilty. When you assure her that you did this voluntarily, she brightens up. \"<i>Well, I am happy to have you all man - so, what were you wanting to speak about?</i>\"");
                    //(Use the Remeeting scene options.)
                    gameFlags[AMILY_AFFECTION] += 2;
                    //mark as agreed to preg-quest!
                    gameFlags[AMILY_OFFER_ACCEPTED] = 1;
                    //(Use the Remeeting scene options.)
                    if (player.lust >= 33) AmilyScene.sexWithAmily();
                    else {
                        // ADD BUTTONS
                        //if (sex != null) simpleChoices("Sex", sex, "Talk", talkToAmily, "Both", talkThenSexWithAmily, "", null, "", null);
                        //		else simpleChoices("", null, "Talk", talkToAmily, "", null, "", null, "", null);
                        doNext(Camp.doCamp);
                    }
                }
            }
            //[Herm to Female]
            else if (player.gender == 2) {
                //Low Affection:
                if (gameFlags[AMILY_AFFECTION] < 15) {
                    outputText("\"<i>Well, I guess it's nice to see another woman around... though I could have used you as all male. So, do you want to talk?</i>\" Amily asks.<br><br>");
                    //(Amily gains a small amount of Affection, begin the Female variant of Amily's quest.)
                    gameFlags[AMILY_AFFECTION] += 2;
                    //UNCOMMENT THIS WHEN CONVERSATION GETS ADDED!
                    //doNext(talkToAmily);
                    //return;
                }
                //Medium Affection:
                else if (gameFlags[AMILY_AFFECTION] < 40) {
                    outputText("\"<i>You didn't need to change yourself for my sake... but, I do like having somebody who can really understand what life in this world is like.</i>\" Amily notes.");
                    //(Amily's affection remains unchanged, but the quest switches to the female variant.)
                }
                //High Affection:
                else {
                    outputText("Amily looks kind of disappointed. \"<i>I will always love you no matter who you are, but... I was kind of used to that nice cock of yours, love.</i>\" She shakes her head. \"<i>Ah, well, if it's you, then sex is sex to me.</i>\" She smiles.");
                    //Set love confession to: GO!
                    gameFlags[AMILY_CONFESSED_LESBIAN] = 2;
                }
            }
            //[Any to Genderless]
            else {
                //Low Affection:
                if (gameFlags[AMILY_AFFECTION] < 15) {
                    outputText("She looks at you in disdain. \"<i>How can you be so stupid as to completely remove all gender from yourself? Get out of my sight and don't come back until you're one gender or the other again!</i>\" She then proceeds to storm off.<br><br>");
                    //(Amily will repeat this scene on each remeeting until the player becomes a gender other than Genderless.)
                }
                else if (gameFlags[AMILY_AFFECTION] < 40) {
                    outputText("She shakes her head sadly. \"<i>I guess this kind of puts a kink in our relationship, doesn't it? Still, I'll always be willing to talk with you.</i>\"<br><br>");
                    //(The player can only Talk with Amily on each remeeting until they have become a gender other than Genderless.)
                }
                //High Affection:
                else {
                    outputText("She looks upset and concerned - but for your sake, not hers. \"<i>I can't imagine what catastrophe robbed you like this. Please, find a way to change yourself back? Man, woman, even herm, I can't bear to see you like this... but I'll give you all the support I can.</i>\"<br><br>");
                    //(The player can only Talk with Amily on each remeeting until they have become a gender other than Genderless.)
                }
            }
        }
        //Genderless tooo
        else {
            //[Low Affection]
            if (gameFlags[AMILY_AFFECTION] < 15) {
                outputText("Amily looks at you with disdain, but you can't help but notice just a small tinge of relief at seeing you have a ");
                if (player.hasCock()) {
                    outputText(player.cockDescript(0), false);
                    if (player.hasVagina()) outputText(" and ");
                }
                if (player.hasVagina()) outputText(player.vaginaDescript());
                outputText(". \"<i>Maybe you're not that stupid after all,</i>\" mutters the mouse before she flounces off.");
                //{player normal encounter options}
            }
            //[Medium Affection]
            else if (gameFlags[AMILY_AFFECTION] < 40) {
                outputText("She notices you have a ");
                if (player.hasCock()) {
                    outputText(player.cockDescript(0), false);
                    if (player.hasVagina()) outputText(" and ");
                }
                if (player.hasVagina()) outputText(player.vaginaDescript(), false);
                outputText(", and she smiles at you. \"<i>I guess this means we can continue with our task?</i>\" You nod in affirmation.  The mouse-girl nods, but turns to leave.  It seems she needs a little time to adjust to this new development.<br><br>");
                //{normal encounter options}
            }
            //[High Affection]
            else {
                outputText("When Amily gazes upon your regained genitals, she instantly hugs you and gives you a deep kiss; ");
                if (player.hasCock()) outputText("bringing your " + player.cockDescript(0) + " to erection");
                if (player.hasVagina() && player.hasCock()) outputText(" and ");
                if (player.hasVagina()) outputText("earning a clench from your " + player.vaginaDescript(0));
                outputText(".  \"<i>I'm so glad you've recovered a gender!</i>\"\n\nAmily turns and stalks off with a spring in her step.  Clearly she's happy, but she still needs some time to get used to it.");
                //{normal encounter options}
                player.changeLust(25 + (player.sens / 10));
            }
            doNext(Camp.returnToCampUseOneHour);
        }
        doNext(AmilyScene.amilyStandardMeeting);
    };

    /********
     *
     * Conversation starts
     *
     *********/

// Opening conversation scene - NEED SPRITE IMAGE TO FINISH, NEED PREGNANCY EVENTS TO FINISH
    AmilyScene.talkToAmily = function () {
        clearOutput();

        if (gameFlags[AMILY_MET_AS] == 2 && player.gender == 2) outputText("You tell Amily that you came here because you wanted to talk with her.<br><br>");
        else outputText("You tell Amily that you came here because you wanted to talk with her, and you have no desire to approach her sexually on this encounter.<br><br>");

        //[Low Affection]
        if (gameFlags[AMILY_AFFECTION] < 15) {
             switch (AmilyScene.amilyPregnancy.pregnancyEventCounter) {
             case 1:
             case 2:
             case 3:
             case 4:
             case 5: //Amily is slightly pregnant
             outputText("\"<i>I could use someone to talk to, I suppose,</i>\" she says plainly, but you can clearly see that she's very happy that's what you want to do.<br><br>");
             break;
             case 6:
             case 7:
             case 8: //Amily is heavily pregnant
             outputText("\"<i>Oh, NOW you want to get to know me,</i>\" she complains, but her tone is gentle – amused even, and she clearly isn't as unhappy as her words may imply. Heavily, she sits herself down unceremoniously. \"<i>But... there are things weighing on my mind. I really could use somebody to talk to.</i>\"<br><br>");
             break;
             default: //Amily is not pregnant */
            if (gameFlags[AMILY_MET_AS] == 2 && player.gender == 2) outputText("\"<i>A chat would be lovely,</i>\" she says, clearly enjoying herself.  \"<i>I... I hardly ever get a chance to find someone to chat with.  Sometimes it seems like everyone in Mareth just wants to breed non-stop...</i>\" she murmers to herself.  \"<i>Well, what shall we talk about?</i>\" she asks, seemingly quite happy with your presence.<br><br>");
            else outputText("\"<i>You want to talk? No sex?</i>\" she asks, clearly having a hard time believing it. \"<i>I... I haven't had the chance to talk to anyone in years. It's been so long...</i>\" she murmurs to herself, and you think you see the start of a tear glinting in her eye. \"<i>Well, what do you want to talk about?</i>\" she asks, seemingly quite happy that's what you're here for.<br><br>");
            }
        }
        //[Medium Affection]
        else if (gameFlags[AMILY_AFFECTION] < 40) {
            outputText("\"<i>Of course, " + player.short + ", I always enjoy our talks.  What shall we discuss this time?</i>\" she asks happily.<br><br>");
        }
        //[High Affection]
        else {
            outputText("She smiles playfully at you. \"<i>And here I was thinking we knew each other already.  But if you want, I'm always happy to talk.</i>\"<br><br>");
        }
        //[/ Go to random [Conversation]]
        doNext(AmilyScene.amilyConversationStart);


    };

// GIANT CONVERSATION TREE START! - - NEED SPRITE IMAGE TO FINISH
    AmilyScene.amilyConversationStart = function () {
        clearOutput();

        // Get a random conversation out of the 15 options
        var convo = rand(15);
        // Bump past convo #12 if she's already at camp because it doesn't make much sense by this point.
        if (convo == 12 && AmilyScene.amilyFollower()) convo++;
        //Girls dont get to listen to amily talk about being knocked up.
        //Herms either unless she's okay'ed them for dad-hood.
        if (player.gender == 2 || (player.gender == 3 && gameFlags[AMILY_HERM_QUEST] < 2)) convo = rand(12);
        //Boost affection!
        gameFlags[AMILY_AFFECTION] += 2 + rand(3);
        //Lower Corruption a tiny bit
        player.modStats("cor", -.34);
        //Conversation: Items

        if (convo == 0) {
            outputText("The two of you swap tales about your respective adventures, and from there the topic drifts to the various potions and elixirs discovered in this world.<br><br>");

            outputText("\"<i>You know...  I don't have the equipment needed to practice alchemy, but I do know a few things about it.</i>\" Amily says.  \"<i>If you can bring me a potion or a reagent, I may be able to remember some of the things my father taught me.</i>\"<br><br>");

            //(If player has no main item:)
            //if (player.itemSlot1.quantity == 0) {
            //   outputText("Promising you'll keep that in mind, you take your leave of Amily.<br><br>");
            //   if (sexAfter) doNext(determineAmilySexEvent());
            //   else doNext(Camp.returnToCampUseOneHour);
            //   return;
            //}
            //(If player has an item:)
            //else {
            outputText("You remember that you have something in your pockets that might be of interest, and show it to Amily.<br><br>");
            //}
            // Item checks only work in the first slot.
            // Player has Equinum in first slot
            if (player.hasItem(Items.Consumables.Equinum)) {
                outputText("\"<i>That's a distillation of horse essence, I think.</i>\" Amily says.  \"<i>I guess it would probably make you stronger and tougher... but horses aren't smart, and it might be too strong for a human to handle without changing them,</i>\" she warns you.<br><br>");
            }
            //Canine Pepper & Variants:
            // THIS PART MAKES NO SENSE! Either combine them all with a big OR clause or write descriptions for each!
            else if (player.hasItem(Items.Consumables.CaninePepper)) {
                outputText("\"<i>Looks kind of like a dog's dick, doesn't it?  Especially this one with the big knot-like bulge or this one with the ball-like bulbs.  I suppose it would make you more dog-like... but I'm pretty sure you should avoid these jet-black ones.  I can't remember why...</i>\" she trails off, wracking her brain.<br><br>");
            }
            //Large Pepper
            else if (player.hasItem(Items.Consumables.CaninePepperLarge)) {
                outputText("\"<i>Looks kind of like a dog's dick, doesn't it?  Especially this one with the big knot-like bulge or this one with the ball-like bulbs.  I suppose it would make you more dog-like... but I'm pretty sure you should avoid these jet-black ones.  I can't remember why...</i>\" she trails off, wracking her brain.<br><br>");
            }
            //Double Pepper
            else if (player.hasItem(Items.Consumables.CaninePepperDouble)) {
                outputText("\"<i>Looks kind of like a dog's dick, doesn't it?  Especially this one with the big knot-like bulge or this one with the ball-like bulbs.  I suppose it would make you more dog-like... but I'm pretty sure you should avoid these jet-black ones.  I can't remember why...</i>\" she trails off, wracking her brain.<br><br>");
            }
            //Black Pepper
            else if (player.hasItem(Items.Consumables.CaninePepperBlack)) {
                outputText("\"<i>Looks kind of like a dog's dick, doesn't it?  Especially this one with the big knot-like bulge or this one with the ball-like bulbs.  I suppose it would make you more dog-like... but I'm pretty sure you should avoid these jet-black ones.  I can't remember why...</i>\" she trails off, wracking her brain.<br><br>");
            }
            //Canine Pepper & Variants:
            else if (player.hasItem(Items.Consumables.CaninePepperKnotty)) {
                outputText("\"<i>Looks kind of like a dog's dick, doesn't it?  Especially this one with the big knot-like bulge or this one with the ball-like bulbs.  I suppose it would make you more dog-like... but I'm pretty sure you should avoid these jet-black ones.  I can't remember why...</i>\" she trails off, wracking her brain.<br><br>");
            }
            //Canine Pepper & Variants:
            else if (player.hasItem(Items.Consumables.CaninePepperBulby)) {
                outputText("\"<i>Looks kind of like a dog's dick, doesn't it?  Especially this one with the big knot-like bulge or this one with the ball-like bulbs.  I suppose it would make you more dog-like... but I'm pretty sure you should avoid these jet-black ones.  I can't remember why...</i>\" she trails off, wracking her brain.<br><br>");
            }
            // Now we're out of the stupid...
            //Succubus Milk/Incubus Draft:
            else if (player.hasItem(Items.Consumables.IncubiDraft) || player.hasItem(Items.Consumables.SuccubiMilk)) {
                outputText("She recoils with a hiss.  \"<i>That's demon fluid, it is - like drinking liquid corruption! Avoid that stuff if you can; it'll turn you into a demon, and supercharge your sex-drive.  I've heard it can even mess with your gender if you drink too much of the opposite stuff.</i>\"<br><br>");
            }
            //Succubi's Delight:
            else if (player.hasItem(Items.Consumables.SuccubiDelight)) {
                outputText("\"<i>Full of taint, no question of that.  Succubi give it to males who haven't become demons yet; makes them better able to produce cum, and pushes them towards demonhood.</i>\"<br><br>");
            }
            /*
             //Wet Cloth:
             else if (player.hasItem(Items.Consumables.We) {
             outputText("\"<i>I... have no idea what that is.</i>\" she says, looking confused.  \"<i>I guess it's... slimey?  Concentrate of goo?  I think it's got something to do with whatever's been polluting the lake, so I wouldn't rub it into your skin.</i>\"<br><br>");
             }*/
            //Bee Honey:
            else if (player.hasItem(Items.Consumables.BeeHoney)) {
                outputText("\"<i>Honey from a giant bee?</i>\" she asks eagerly, perking up.  \"<i>Oh, that stuff's delicious! I hear it's full of special essences secreted by the giant bees, though, so it could have transformative effects.</i>\"<br><br>");
            }
            /*
             //Pure Honey:
             else if (player.hasItem(Items.Consumables.) {
             outputText("\"<i>You managed to get your hands on ultra-pure giant bee honey?</i>\" she asks, sounding impressed.  \"<i>I hear that stuff's so pure it can actually help purge the eater of demonic taint - but it's probably otherwise the same as regular bee honey.</i>\"<br><br>");
             } */
            //Whisker Fruit:
            if (player.hasItem(Items.Consumables.WhiskerFruit)) {
                outputText("\"<i>That's a whisker fruit,</i>\" Amily says, \"<i>It might give you cat ears and even tail! It would make you cute-looking!</i>\"<br><br>");
            }
            //Pigtail or Boar Truffle:
            if (player.hasItem(Items.Consumables.PigTruffle)) {
                outputText("\"<i>That's a pigtail truffle,</i>\" Amily says, \"<i>It might give you pig ears and even tail! It would make you plump and cute-looking!</i>\"<br><br>");
            }
            /*
             //Green Glob:
             else if (player.hasItem(Items.) == useables.GREENGL) {
             outputText("\"<i>A blob of slime from a green gel?  Hmm...</i>\" she looks thoughtful.  \"<i>I think I remember my dad once telling me you could make a really strong armor out of a special distillation of green oozes.  I can't say for sure, and I wouldn't have the equipment even if I did remember.</i>\"<br><br>");
             }
             //Bee Chitin:
             else if (player.itemSlot1.itype == useables.B_CHITN) {
             outputText("\"<i>If you had a sufficient mass of this stuff, you could make a suit of armor out of it.  It needs special alchemical reagents, though, otherwise it'll just get all brittle and smashed up.</i>\"<br><br>");
             }
             //Spider Silk:
             else if (player.itemSlot1.itype == useables.T_SSILK) {
             outputText("\"<i>Some spider silk? I think I remember someone who could take these and make them into armor or even comfortable robes.</i>\"<br><br>");
             }
             //Dragon Scale:
             else if (player.itemSlot1.itype == useables.D_SCALE) {
             outputText("\"<i>Dragonscale? I never knew dragons existed");
             //if (camp.followerKiha() || camp.followerEmber()) outputText(" until");
             //if (camp.followerKiha()) outputText(" Kiha");
             //if (camp.followerKiha() && camp.followerEmber()) outputText(" and");
             //if (camp.followerEmber()) outputText(" Ember");
             //if (camp.followerKiha() || camp.followerEmber()) outputText(" came to your camp");
             outputText(". They could be made into flexible yet protective armor.</i>\"<br><br>");
             }
             //Imp Skull:
             else if (player.itemSlot1.itype == useables.IMPSKLL) {
             outputText("\"<i>The skull of an imp? I hunt imps and sometimes, I would cut their head off and take their skulls as trophy. " + (gameFlags[CAMP_WALL_PROGRESS] >= 100 ? "I'll hang some the skulls on the wall around your camp. You did a good job with the wall though." : "") + "</i>\"<br><br>");
             }*/
            else {
                outputText("She looks at it and shrugs, not really familiar with it.<br><br>");
            }
            outputText("Thanking her for her help, you return the item to your pocket");
            //if (sexAfter) outputText(".<br><br>");
            //else
            outputText(" and take your leave of the mouse-girl.<br><br>");
        }
        //Conversation: Minotaurs
        else if (convo == 1) {
            outputText("The two of you swap tales about your respective adventures, and from there the topic drifts to the strange bull-men that you have seen haunting the mountains.<br><br>");

            outputText("\"<i>You were lucky to get away with your skin intact.</i>\" Amily tells you emphatically.  \"<i>Minotaurs are dangerous brutes - they're one of the biggest, strongest and toughest beasts around.  I don't dare go near the mountains, not with those beasts roaming around.  Sometimes they carry around huge axes, but usually they make do with just their huge, knuckley fists.</i>\"<br><br>");

            outputText("You ask her why it is that minotaurs are so dangerous; they don't seem to look like demons.<br><br>");

            outputText("\"<i>They may as well be demons, now. Oh, they may not look corrupted, but all they care about is finding something to rut with - man, woman, both, neither, they don't care.  So long as it's got a hole, they'll fuck it...  I think maybe I heard somewhere that they can only reproduce by raping other creatures with a vagina now, but I don't remember where.</i>\"  She looks perturbed, but why you can't say for certain.<br><br>");

            outputText("You ask her then if she has any advice on how to deal with them.<br><br>");

            outputText("Amily laughs.  \"<i>Not really; me, I run if ever I see them.  I'm not a stand-up fighter to begin with, but against those brutes?  And it's not just their strength, either...  I think they've got some kind of addictive chemical in their cum.  The stink of their presence alone can make you feel turned on.  There was this one that managed to corner me; it pulled out its huge horse-cock and started masturbating.</i>\"  She shudders in disgust.  \"<i>I narrowly missed getting sprayed, but the smell... it was intoxicating.</i>\"  She admits, clearly embarrassed.  \"<i>My legs nearly buckled from arousal - it was so tempting to just give in and let him fuck me.</i>\"<br><br>");

            outputText("You ask her what she did.<br><br>");

            outputText("\"<i>I fought it off and ran,</i>\" she insists, looking a little insulted, ");
            //(If player hasn't had sex with Amily:
            if (gameFlags[AMILY_FUCK_COUNTER] == 0) outputText("\"<i>I am still a virgin, after all.</i>\"<br><br>");
            //(If player has had sex with Amily:
            else outputText("\"<i>I was a virgin when we met, in case you forgot.</i>\"<br><br>");

            outputText("\"<i>The big brute was stupid enough to follow me; once I got to the trees, where he couldn't get around so easily, I put a poisoned dart in each of his eyes.  When he stopped thrashing around, I walked up and slit his throat.</i>\"<br><br>");

            outputText("She looks quite proud of herself for that.  Feeling a bit disturbed by her ruthlessness, you thank her for the warning");
            if (sexForced) outputText(".<br><br>");
            else outputText(" and excuse yourself.<br><br>");
        }
        //Conversation: Sand Witches
        else if (convo == 2) {
            outputText("The two of you swap tales about your respective adventures, and from there the topic drifts to the mysterious female magic-users you've seen in the Desert.<br><br>");

            outputText("\"<i>Sand Witches, eh? Funny, it seems the only pseudo-humans left in this area that aren't demons are magic-users... even though it was their usage of magic that turned the first demons into demons,</i>\" Amily notes.  \"<i>Or so I heard, anyway,</i>\" she adds.<br><br>");

            outputText("You ask her if she knows what the Sand Witches are trying to do out there in the desert.<br><br>");

            outputText("\"<i>Not a clue.  I think... I think that they might be some kind of druidic sect or something. Restoring life to the desert, trying to make it into grassland or something like that,</i>\" Amily suggests.<br><br>");

            outputText("You ask her why she comes to that conclusion.<br><br>");

            outputText("\"<i>Have you seen them under those robes?  They're all women, they all have two pairs of breasts, and those breasts are always bloated huge with milk.  My guess is that they've gone mad like those Fetish Cultists; they're not proper demons, but they're still sex-warped.  Maybe they use milk to try and nourish seedlings or something,</i>\" the mouse-woman shrugs.<br><br>");

            outputText("You ask her how on earth she would know that all Sand Witches have four milk-filled breasts.  She blushes deeply and fidgets, clearly embarrassed.  Finally, she speaks up.<br><br>");

            outputText("\"<i>I... kind of got lost in the desert once.  A Sand Witch approached me and asks me if I'd let her cast a spell on me.  When I refused, she attacked, trying to beat me down so she could cast it on me anyway.</i>\"<br><br>");

            outputText("You interrupt to ask her what the spell would have done.<br><br>");

            outputText("\"<i>How should I know? Make me into some kind of milk-producing slave?</i>\" Amily retorts fiercely, tail lashing in agitation.  \"<i>I didn't give her a chance to use it.  Three sleeping potion darts in her face, quicker than she could blink.  I was annoyed, so I pulled off her robes to bind her limbs - I figured that'd slow her down long enough when she woke up that I'd be far away.  Her breasts were full of milk - so full I could see it leaking out of each nipple.</i>\"  She blushes intently, clearly embarrassed.  \"<i>I... I hadn't had anything to eat or drink for ages, I was starving and thirsty and so I...</i>\"<br><br>");

            outputText("You assure her that she doesn't need to spell it out.  She looks grateful, then continues.<br><br>");

            outputText("\"<i>So, I had just drunk my fill, feeling fuller then I had in weeks, and then, you won't believe it, another Sand Witch shows up - from the things she was saying, I must have accidentally interrupted some kind of lesbian tryst they had planned.  I grab my stuff and bolt for safety - not quick enough to keep her from casting some spell that makes this stone orb fly up my... my...</i>\"  She blushes again.  \"<i>It was like having some kind of vibrating sex toy jammed up there. I don't know how I managed to run away with it, but when I got too far, it dissolved into sand and just fell out.  I don't think they can take much punishment, but they've clearly got some nasty tricks.</i>\"<br><br>");

            outputText("Thanking her for the advice, you promise you'll be more careful if you see them in the future");
            if (sexForced) outputText(".<br><br>");
            else outputText(" and take your leave.<br><br>");
        }
        //Conversation: Giant Bees
        // Amily says she's been willing to host giant bee eggs on occasion, but will pointedly remind the player she was a virgin when they met. And the player makes no comment about HOW this is possible? Unless anal pregnancy is a thing in Ingnam, this seems like a strange reaction.
        else if (convo == 3) {
            outputText("The two of you swap tales about your respective adventures, and from there the topic drifts to the strange bee-like women you've seen in the forest.<br><br>");

            outputText("\"<i>Giant Bees?  They're a strange race,</i>\" Amily says.  \"<i>They're not really corrupt, but at the same time, they act kind of like demons.</i>\"<br><br>");

            outputText("You ask her to explain how that works.<br><br>");

            outputText("\"<i>Well... the Giant Bees you've probably seen?  The official name for them is the fertile caste, but folks tend to just call them handmaidens,</i>\" Amily explains.<br><br>");

            outputText("At your confused look, she continues.<br><br>");

            outputText("\"<i>Giant Bees hatch from each egg as hundreds of regular-looking little bees.  And fertiles are involved in that - for some reason, the eggs need to incubate inside a living being to hatch in the first place.</i>\"<br><br>");

            outputText("Your expression probably tells the story, because Amily giggles slightly before adding.  \"<i>It's not dangerous or anything like that!  The queen and the handmaidens both have this cock-like appendage on their abdomens; the queen uses this to lay her eggs into the handmaidens, filling up their abdomens, while the handmaiden then lays a mixture of eggs and honey into a person's gut via their anus.  The eggs kind of... well, they sit there, and then, when they're ready to hatch, they just... come out.</i>\"<br><br>");

            outputText("She shrugs, clearly not able to explain it any better than that.  You ask how you can avoid such a fate.<br><br>");

            outputText("\"<i>Well, they mainly use this hypnotic thrumming from their wings; but if you've got a strong, sharp mind you can shake it off.  They aren't the kind to get violent; they will ask you to accept their eggs, if you resist their hypnosis, but they won't try to beat you into submission so they can lay their eggs.  I wouldn't recommend fighting them; they're quick and pretty tough, thanks to that armor, and they've got this nasty venom that saps your strength and arouses you at the same time.</i>\"<br><br>");

            outputText("You thank her for her advice, and then, curious, ask how she knows so much about these creatures.<br><br>");

            outputText("Amily looks flustered.  \"<i>Well, they, they have been willing to trade honey in the past if you confront them peacefully and... alright, I'll admit it, when times have been really lean, I've been willing to host some giant bee eggs in exchange for honey.</i>\"<br><br>");

            outputText("You smile and thank her for sharing, noting that she didn't need to tell you such personal information", false);
            if (sexForced) outputText(".<br><br>");
            else outputText(", and politely excuse yourself.<br><br>");
        }
        //Conversation: Fetish Cultists & Zealouts
        else if (convo == 4) {
            outputText("The two of you swap tales about your respective adventures, and from there the topic drifts to the bizarrely-dressed people you've caught glimpses of around the lake.<br><br>");

            outputText("Amily thinks fiercely, then shakes her head, looking apologetic.  \"<i>I'm sorry, I don't know anything about them.  They're new to this area, I can tell you that much.  It looks like they have some weird magic that lets them change their clothes at random.  I stay away from them; there's something about them that reminds me of demons, but they're... scarier, somehow.</i>\"<br><br>");

            outputText("Telling her that it's all right if she doesn't know that much, you get up");
            if (sexForced) outputText(" and sigh.<br><br>");
            else outputText(" and leave.<br><br>");
        }
        //Conversation: Imps
        else if (convo == 5) {
            outputText("The two of you swap tales about your respective adventures, and from there the topic drifts to the small demons you've seen in your travels.<br><br>");

            outputText("\"<i>Imps!</i>\" Amily spits, looking fierce.  \"<i>Disgusting demon vermin, that's what they are! All over the place, looking to rape anything they can get their hands on.  They're puny little creatures, and they're easy to cut down, but they use black magic to try and make you so horny they can rape you.  I kill them wherever I find them, but there's always more and more of them.</i>\"<br><br>");

            outputText("Her tail is lashing furiously from side to side, and, clearly worked up, she tensely excuses herself ");
            if (sexForced) outputText("to regain her composure before your sexplay.<br><br>");
            else {
                outputText("and leaves.");
                if (gameFlags[AMILY_FOLLOWER] == 0) outputText("  As you set off back to camp,");
                else outputText("  As you sit back down in camp,");
                outputText(" you have little doubt that she's gone to find and kill an imp.<br><br>");
            }
        }
        //Conversation: Shark Girls
        else if (convo == 6) {
            outputText("The two of you swap tales about your respective adventures, and from there the topic drifts to the humanoid female sharks you've seen while rowing your boat.<br><br>");

            outputText("\"<i>Shark Girls? Near as I can tell, they used to be a village of humans who lived right here on the lake... then the lake got polluted, and turned them all into... well, what they are now.</i>\"<br><br>");

            //if (!izmaFollower()) outputText("She looks pensive.  \"<i>Odd... I don't think they have any males left, but on very rare occasions I've seen these weird tiger-striped Shark Girls... and they always had huge cocks and balls as well.  But, whether female or herm, they seem to only care about fighting and fucking... and from the way I've seen them going at it, I don't think they see any difference between the two any more.</i>\"<br><br>");

            outputText("You ask her if she has any advice on fighting them.<br><br>");

            outputText("\"<i>I'm afraid not.  They don't come to the shore too often, never mind too far out of the lake. They're probably resistant to pain and have a really wicked bite, though,</i>\" she tells you.<br><br>");

            if (!sexForced) outputText("Thanking her for her time, you take your leave of her.<br><br>");
            else outputText("You thank her for her time as the conversation winds down.<br><br>");
        }
        //Conversation: Goblins
        else if (convo == 7) {
            outputText("The two of you swap tales about your respective adventures, and from there the topic drifts to the strange green women you've seen in the forest and the mountains.<br><br>");

            outputText("\"<i>Ah, Goblins.</i>\" Amily says, shaking her head sadly.  \"<i>Yet another race corrupted by the demons.  Used to be that all they wanted was to experiment with potions and build machines.  Now all they do is fuck... Weird thing is, they seem to actively want to get pregnant.  I've heard that giving birth is like the biggest, most prolonged orgasm to them.</i>\"<br><br>");

            outputText("You ask if they're aggressive.<br><br>");

            outputText("\"<i>Not particularly... but, if you're female, they may get territorial and attack without warning, and if you've got a penis, they'll want to have sex with you, even if that means beating you into submission.  They're... honestly kind of puny.  If you can dodge the lust potions and poisons they throw, they basically can't do anything to you.</i>\"<br><br>");

            if (!sexForced) {
                if (gameFlags[AMILY_FOLLOWER] == 0) outputText("Thanking her for her time, and the warning, you head back to your own camp.<br><br>");
                else outputText("Thanking her for her time, and the warning, you sit back down in your camp.<br><br>");
            }
            else outputText("You thank her for her time as the conversation winds down.<br><br>");
        }
        //Conversation: What was life in her village like?
        else if (convo == 8) {
            outputText("You think for a moment, wondering what to ask her. Then you shrug your shoulders and tell her that you'd like to know a little more about her, that you want to get to know her better.<br><br>");

            outputText("Amily looks surprised... but pleased.  \"<i>I... You're really interested in hearing about me?  Well... okay.  What do you want to know?</i>\"<br><br>");

            outputText("You rack your brains for a few moments, then ask her to tell you what life was like in her village, before everything.<br><br>");

            outputText("\"<i>Well, what was life like in your village, huh?</i>\" she responds immediately.  \"<i>If I gotta share something private like that, then the least you can do is reciprocate.</i>\"<br><br>");

            outputText("Her tone is light and playful, you think she may only be teasing, but you decide that it is fair.  And so you start to talk, telling her about your village; you describe the people, your friends, the places you liked to go.  She sits and stares at you, clearly not expecting you to share that kind of information, but she looks quite appreciative, and she listens intently.  Finally, when you finish, she gives a soft, sad smile, shakes her head, and then starts to speak.<br><br>");

            outputText("\"<i>Life in the village, huh? It was so many years ago... and yet, I can remember it almost like it was yesterday.  The demons had already been around for a few years by the time I remember - I think I was born maybe shortly after they first appeared, I haven't celebrated my Day of First Breath in so long I don't really know how old I am.  We had walls to protect the village, and guards, but we never really believed that we would ever have to fight.  We were a peaceful, quiet little village; we had nothing of real monetary worth, we thought we would be safe, that the demons would just ignore us.  We fished in the lake, went swimming and sailed boats to amuse ourselves, we gathered fruits and nuts and berries and mushrooms from the forest, we hunted birds and small game for meat.</i>\"<br><br>");

            outputText("She sighs softly.  \"<i>We were fools... but we were so happy, can we be blamed for being fools?  Life wasn't perfect, the hunters often had to hunt imps, but they never invaded our streets, and so we thought we were safe.  We quarreled and made up, we laughed and loved and lived...  It was such a wonderful time.</i>\"<br><br>");

            outputText("You see a small tear form in her eye and trickle down her cheek.  Unable to say why, you reach out and wipe it away with your finger.  She looks at you, startled");
            if (!sexForced) outputText(", and, embarrassed and unable to explain why you did that, you politely take your leave.");
            else outputText(", before giving you a warm smile.<br><br>");
        }
        //Conversation: Who was she before it was all lost?
        else if (convo == 9) {
            outputText("You think for a moment, wondering what to ask her.  Then you shrug your shoulders and tell her that you'd like to know a little more about her, that you want to get to know her better.<br><br>");

            outputText("Amily looks surprised... but pleased.  \"<i>I...  You're really interested in hearing about me?  Well... okay.  What do you want to know?</i>\"<br><br>");

            outputText("You rack your brains for a few moments, then ask her to tell about herself, about who she was, before everything.<br><br>");

            outputText("\"<i>Well, what were you like before you came to this world, huh?</i>\" she responds immediately.  \"<i>If I gotta share something private like that, then the least you can do is reciprocate.</i>\"<br><br>");

            outputText("Her tone is light and playful, you think she may only be teasing, but you decide that it is fair.  And so you talk to her, you tell her about your own family, your own childhood.  She listens intently, laughing with you at the funny things you remember, and nodding with sombre empathy at the sad things.  Finally, when you finish, she gives a soft, sad smile, shakes her head, and then starts to speak.<br><br>");

            outputText("\"<i>Who was I?  Well... I was nobody, really. Just an average little girl, a face in the crowd.  Daddy was an alchemist; he made a lot of his money in those days working to purify items that were tainted in some fashion, but his primary goal was trying to come up with a concoction that could actually help purify someone who had been tainted already.  He thought that there might be something worth investigating in Pure Giant Bee Honey, but he never did succeed.</i>\"<br><br>");

            outputText("You ask if she didn't get on with her father.<br><br>");

            outputText("\"<i>What?</i>\" she asks, clearly surprised.  \"<i>No, he loved me, and I loved him, but he didn't have a lot of free time.  I tried to take an interest in learning alchemy, it was a way to get closer to him, but it never really interested me that much.</i>\"  She smiles, amused.  \"<i>I was really more of a mommy's girl than a daddy's girl, I guess.</i>\"<br><br>");

            outputText("You ask her to tell you about her mother.<br><br>");

            outputText("\"<i>She was a hunter - one of the best in the village.  Quick enough to run a deer to ground, quiet enough that it wouldn't know she was there until her knife was at its throat, skilled enough with a blowpipe to pin a fly to a tree from fifty paces without killing it,</i>\" Amily boasts.  \"<i>I admired her - I adored her, I wanted to be just like her.  I was always bugging her to teach me, and she worked hard to help me get good.  Everyone always said I was going to be just like her.</i>\"  She smiles... and then she looks sad.  \"<i>If it wasn't for those skills, I mightn't have survived when the demons came.</i>\"<br><br>");

            outputText("Gently, you reach out and take her hand, trying to offer her some comfort, and then ask what happened to her parents.<br><br>");

            outputText("\"<i>I... I don't know.</i>\" She sniffs.  \"<i>The last I saw of them, daddy was throwing some exploding potions at a tentacle beast, and mom was yelling at me to run, to run as fast as I could and hide myself in the wilderness while she took on a pack of imps.  I haven't seen them since.</i>\"  Her voice cracks, and she buries her head in her hands.<br><br>");

            outputText("\"<i>I'll be alright,</i>\" she sobs.  \"<i>But... please... leave me alone now? Please?</i>\"<br><br>");

            outputText("Wanting to respect her privacy, you place a hand on her shoulder and give her a squeeze, attempting to convey that you will always be ready to talk if she needs it.");
            if (!sexForced) outputText("  Then you leave her, giving her the chance to mourn her lost family.<br><br>");
        }
        //Conversation: How did it fall?
        else if (convo == 10) {
            outputText("You think for a moment, wondering what to ask her.  Then you shrug your shoulders and tell her that you'd like to know a little more about her, that you want to get to know her better.<br><br>");

            outputText("Amily looks surprised... but pleased.  \"<i>I... You're really interested in hearing about me?  Well... okay.  What do you want to know?</i>\"<br><br>");

            outputText("Hesitantly, you ask her what happened to cause her village to fall.  Why is she the only survivor?<br><br>");

            outputText("Amily looks shocked, and then sad.  \"<i>I knew you would ask this, eventually,</i>\" she murmurs.  Her gaze unfocuses itself, memories she evidently would rather not recall coming flooding back.  \"<i>It was the evening of the annual autumn festival.  We were all in the town square, celebrating the end of another year and our success in stockpiling food to see us through the winter.  That was when they came... a horde of them, spilling over the walls, smashing through the gates. We had no sentries up... we had no forewarning.  We didn't know they were there until the screaming started.</i>\"<br><br>");

            outputText("You realize she's starting to shiver.<br><br>");

            outputText("\"<i>There were so many of them... so horrible.  Imps by the dozens, the hundreds, succubi, incubi, creatures I can't even name.  Twisted forms, all blurring into each other...</i>\"<br><br>");

            outputText("You place a hand on her shoulder, trying to draw her back into the real world.  She stops shaking and continues, calmer.<br><br>");

            outputText("\"<i>We had no weapons - we hadn't been well armed even before, and who took spears and daggers to a festival?  It was pandemonium - we scattered in all directions like brainless animals.  The demons just had to pick us off. Some tried to fight, but they were quickly overwhelmed - beaten down by superior force.  Some of us must have gone mad from the corruption boiling off of them, because they just gave up and let the demons have them.  I... I saw this one boy, he couldn't have been more then a year or two older than me.  I could only watch as he just opened his arms and looked up blissfully at this monster with a human woman's face, cat ears, six pairs of big, milk-seeping breasts and a horse's cock as long as she was tall.  She grabbed him, and forcefed him that huge dick - rammed down his throat and he just swallowed it and swallowed it, looking delighted as she pushed him to the limit.</i>\"<br><br>");

            outputText("\"<i>You can't imagine what it was like.  Things flapping through the darkness, twisted shapes springing out of the gloom, the stink of blood, urine, milk and cum, screaming, laughing, roaring, howling... I don't know how the fire started, it could have been any of a dozen reasons.  All I knew, when it was over, and I dared creep back into the ruins of what had been my home...  I was the only one left.</i>\"<br><br>");

            outputText("Tears are pouring down her face.  Unable to think of anything else to do, you wrap your arms around her, holding her as she leans against you and weeps silently.  Finally, you feel her tears stop, and she gently pushes you away.<br><br>");

            outputText("\"<i>Thank you.  It's been so long... but it still hurts, remembering.</i>\"<br><br>");

            outputText("You tell her that you're sorry for bringing up such painful memories", false);

            if (sexForced) outputText(".");
            else outputText(", then excuse yourself once you are certain she is okay.<br><br>");
        }
        //Conversation: How did she survive?
        else if (convo == 11) {

            outputText("You think for a moment, wondering what to ask her.  Then you shrug your shoulders and tell her that you'd like to know a little more about her, that you want to get to know her better.<br><br>");

            outputText("Amily looks surprised... but pleased.  \"<i>I... You're really interested in hearing about me?  Well... okay.  What do you want to know?</i>\"<br><br>");

            outputText("You ask her, hesitantly, how she managed to survive the destruction of her village, and how she's stayed alive ever since.<br><br>");

            outputText("She looks not upset, like you feared, but confused.  \"<i>I haven't explained that already?</i>\" She asks.  \"<i>I ran.  I ran as fast as I could for my house - I ran for my hunting knife and my blowpipes.  And then, my parents ordered me to run into the wilderness and hide.  I didn't want to go, but I obeyed.  I just ran and ran all through the night, stopping only when I was exhausted - and even then, I crawled into a hollow at the roots of a tree to hide.  I slept until hunger woke me, foraged for something to eat, and then I crept back to my village.  I found it ruined, and I've lived here ever since.</i>\"<br><br>");

            outputText("\"<i>As for day to day survival...</i>\"  She shrugs.  \"<i>I do what my mother taught me.  I hunt.  I forage.  I managed to find and store a lot of left-behind food after I was sure the village was no longer being occupied, but that was eaten or went off years ago. I managed to scavenge a few bits of alchemical equipment from my parents' home, and from the other village alchemists - not enough to do anything complicated, but enough to build a water purifier in a hidden cove, so I could distill the lake water and make it drinkable.  I also have water traps set up to catch rainwater and morning condensation. I may not be a real alchemist, but I do know what plants, animals and fungi are poisonous and I can whittle new darts for my blowpipe to use them with.  I have snares set up and I check them regularly.</i>\"<br><br>");

            outputText("She grins at you, mischievously.  \"<i>Any more questions?</i>\"<br><br>");

            outputText("You shake your head \"<i>no</i>", false);
            if (!sexForced) {
                if (gameFlags[AMILY_FOLLOWER] == 0) outputText("\", politely excuse yourself, and head back to your own camp. It sounds like she's doing better at keeping a steady supply of food and water going than you are.  But if that's the case... why does she look so thin?<br><br>");

                else outputText("\", politely excuse yourself, and sit back down in camp.  It sounds like she's doing better at keeping a steady supply of food and water going than you are.  But if that's the case... why does she look so thin?<br><br>");
            }
            else outputText(".\"");
        }
        //Conversation: What does she plan to do when she gives birth?
        else if (convo == 12) {
            outputText("You think for a moment, wondering what to ask her. Then you shrug your shoulders and tell her that you'd like to know a little more about her, that you want to get to know her better.<br><br>");

            outputText("Amily looks surprised... but pleased. \"<i>I... You're really interested in hearing about me? Well... okay. What do you want to know?</i>\"<br><br>");

            outputText("You point out that she's told you why she wants you to father children with her, but she hasn't told you what she will do once she gives birth.<br><br>");

            outputText("\"<i>You actually care what happens to them afterwards?</i>\" She asks, seemingly having a hard time believing that.<br><br>");

            outputText("You insist that, yes, you do want to know.<br><br>");

            outputText("\"<i>Alright... Many of the races that are corrupt are able to breed very quickly; their pregnancies don't take too long, and their offspring grow to full size in a span that can take from minutes to hours,</i>\" she begins explaining, \"<i>My own race is quite fertile; if we don't take a certain herbal medicine, we can have up to two dozen children in a single pregnancy.  My plan is to take advantage of both those facts... Now that I have a pure human like you to father them for me.</i>\"<br><br>");

            outputText("You ask how that is supposed to work, given that she is very obviously not corrupt.<br><br>");

            outputText("\"<i>You may have seen Goblins while you were exploring?  Well, they're corrupted creatures, but their corruption stems from chemicals in their blood.  I managed to... persuade... a Goblin to get me some samples of a distillation of that specific chemical.  Once I am certain I am pregnant, I can take a vial to cause my pregnancy to advance really quickly, and for the children to grow to full maturity in one or two weeks, like a Goblin does.</i>\"<br><br>");

            outputText("Feeling a little enlightened, you then ask her just why she needs to have so many children, and so fast.  You remember that she wants her race to be reborn outside of demonic slavery, but what will she do when she judges she has enough.<br><br>");

            outputText("\"<i>Well, I don't exactly have a specific number of kids I want to deliver,</i>\" she explains.  \"<i>The Goblin only gave me five vials of that chemical; five pregnancies are all I'll get.  Once I use them, and they're all grown big and strong, we can leave this area and find ourselves somewhere else to found a new village.  In a place where the demons can't get us, we can work on expanding our numbers, bringing my people back to life as something other than just fucktoys.</i>\"<br><br>");

            outputText("You thank her for the explanation.<br><br>");
        }
        else if (convo == 13) {
            //[Amily Talks About Kitsune]
            outputText("The two of you swap tales about your respective adventures, and from there the topic drifts to the odd many-tailed fox women you've seen deep in the woods.<br><br>");

            outputText("\"<i>Kitsune,</i>\" she says matter-of-factly, nodding gently.  \"<i>There's a race that's hard to categorize, if there ever was one.</i>\"<br><br>");

            outputText("You ask her what she means by this.<br><br>");

            outputText("\"<i>Well, they don't seem to be demons, exactly, but they do share a few things in common with them.  In spite of that, they somehow seem to have an amazing resistance to corruption.  From the tales I've heard, they existed in their current form already for a long time before the demons arrived,</i>\" she explains. Seeing your perplexed expression, she continues.  \"<i>They have extremely potent magic, and they draw their power from living things to sustain it.  They can get it in lots of ways, but it seems like their favorite way is through sexual contact.  They form a sort of...  link, with their partner, I suppose, and absorb small amounts of their life energy.</i>\"<br><br>");

            outputText("You nod, noting that you can see how that is similar to some of the demons you've come across.<br><br>");

            outputText("\"<i>Physically, they're not the strongest, but they don't have to be – once they've got you caught in one of their illusions, you're pretty much under their power. Despite that, they don't seem to be particularly evil... at least, for the most part.</i>\"<br><br>");

            outputText("You give her a slightly quizzical look and then press her on the details.<br><br>");

            outputText("\"<i>Well... I've never seen one face-to-face, but I've heard some other travelers tell stories about meeting corrupted kitsune.  Nasty pieces of work, if any of it's true.  Most kitsune are fairly innocuous, if a little irritating.  Sometimes they can actually be pretty friendly, if you play along right.  They seem to get off on making mischief, but it's more or less harmless – the worst that ever happens is you wind up getting lost in the woods or find some kind of treasure that turns out to be a box of rocks when you bring it home.  The corrupted ones though... they cross a line.  Their tricks are downright vindictive... and once they finish tormenting you, they'll suck the life right out of you without a moment's hesitation.</i>\"<br><br>");

            outputText("You ask how anyone knows this much about them, if even meeting one is so dangerous.  Amily scratches her head a bit and blushes, clearly a little embarrassed to not have a definitive answer for this one.  \"<i>W-well... it's mostly just conjecture.  Like I said, I'm only repeating what I've heard.</i>\"<br><br>");

            outputText("She pauses for a moment, and then speaks up with another interesting fact in an attempt to save face.  \"<i>They do seem to have a strange fascination with tentacle beasts, for some reason.</i>\"<br><br>");

            outputText("From the blush on her face, you get the feeling that she may be speaking from experience.  You don't press her on the matter though, ");

            outputText("just nodding politely as you process the information.");
        }
        //Conversation: How will she care for her children?
        else {
            outputText("You think for a moment, wondering what to ask her.  Then you shrug your shoulders and tell her that you'd like to know a little more about her, that you want to get to know her better.<br><br>");

            outputText("Amily looks surprised... but pleased.  \"<i>I...  You're really interested in hearing about me?  Well... okay.  What do you want to know?</i>\"<br><br>");

            if (gameFlags[AMILY_FOLLOWER] == 0) {
                outputText("You pause for a few moments, trying to think of a way to phrase this delicately, then ask her how she plans on caring for her children.<br><br>");

                outputText("She looks puzzled and not quite sure if she wants to be amused or offended.  \"<i>I do have lots of food stockpiled - that's why I'm looking thinner than usual, in fact; I've been carefully saving up and preserving as much food as I can.  Or did you think I was that bad a hunter and forager?  I wouldn't have lasted all these years if I was,</i>\" she states.  \"<i>Besides, I have a special potion I bartered from some goblins... within a week or two, any children I have will be grown enough to hunt and forage for themselves.  Don't worry, I can handle looking after them.</i>\"<br><br>");
            } else {
                outputText("You pause for a few moments, trying to think of a way to phrase this delicately, then ask her how she thinks your children are doing.<br><br>");

                outputText("A hint of worry creeps into her expression, matching your own; but she remains resolute. “<i>The first of our kids grew up so fast, and they seem to be doing OK out there without their parents to dote on them. The eldest are doing a great job caring for the young ones.</i>” she answers.<br><br>");
            }

            outputText("Feeling somewhat more reassured, but not entirely so, you get ready to leave.<br><br>");

            outputText("\"<i>Hey, hold on a second,</i>\" Amily tells you.  \"<i>You were worried, weren't you? Worried about me...? About the children?</i>\"<br><br>");

            outputText("You nod and admit you were worried, yes.<br><br>");

            outputText("\"<i>That's... that's sweet of you,</i>\" Amily says, clearly shocked.  \"<i>I didn't think you would actually care...</i>\" she trails off, looking thoughtful.");
            if (!sexForced) {
                if (gameFlags[AMILY_FOLLOWER] == 0) outputText("  Then, as if realising you are still here, she waves at you to go, getting up and leaving herself.  Wondering what that was about, you return to camp.<br><br>");
                else outputText("  Then, as if realising you are still here, she waves at you to go, getting up and leaving herself.  Wondering what that was about, you sit down in camp.<br><br>");
            }
        }

        if (sexForced == true) {
            sexForced = false;
            //outputText("DEBUGGER: IN SexAfter Loop in Conversation Tree.");
            doNext(AmilyScene.determineAmilySexEvent);
            return;
        }
        //outputText("DEBUGGER: OUT SexAfter Loop in Coversation Tree.");
        doNext(Camp.returnToCampUseOneHour);


    };


//Talk and then Sex - NEED SPRITE IMAGE AND PREGNANCY EVENTS TO FINISH
    AmilyScene.talkThenSexWithAmily = function () {
        clearOutput();

        outputText("You tell Amily that you came here because you wanted to talk with her.  If she feels like having sex when you are done, though, you would be happy to oblige.<br><br>");
        switch (AmilyScene.amilyPregnancy.pregnancyEventCounter) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5: //Amily is slightly pregnant
                //[Low Affection]
                if (gameFlags[AMILY_AFFECTION] < 15) {
                    outputText("She rubs her belly thoughtfully. \"<i>I guess a bit of conversation would be nice, after all this time. Sex, though? Maybe if you're lucky.</i>\" She's already heading off, encouraging you to follow her.<br><br>");
                    //[/ Go to random [Conversation], then small chance of [Low Affection Sex]]
                    doNext(AmilyScene.amilyConversationStart);
                }
                //[Medium Affection]
                else if (gameFlags[AMILY_AFFECTION] < 40) {
                    outputText("\"<i>Talking to you is always nice... and, why the hell not? I'm not that big yet, I don't think?</i>\"<br><br>");
                    outputText("You assure her that she still looks trim and lean to you.<br><br>");
                    outputText("\"<i>Flatterer. Come on, I have something to eat back in my den.</i>\"<br><br>");
                    //[/ Go to random [Conversation], then to [Medium Affection Sex]]
                    doNext(AmilyScene.talkToAmilyWithSexAfter);
                }
                //[High Affection]
                else {
                    outputText("\"<i>Well, I could maybe do without the sex part...</i>\" Amily muses, rubbing her chin. Then she grins. \"<i>We'll see how things work out, all right?</i>\"<br><br>");
                    outputText("You assure her that's fine, and the two of you find a relatively comfortable patch to sit down on so you can talk.<br><br>");
                    //[/ Go to random [Conversation], then to [High Affection Sex]]
                    doNext(AmilyScene.talkToAmilyWithSexAfter);
                }
                break;
            case 6:
            case 7: //Amily is heavily pregnant
                //[Low Affection]
                if (gameFlags[AMILY_AFFECTION] < 15) {
                    outputText("She stares at you, then smiles faintly. \"<i>Talk? Talk is good... it's so quiet here; I spent so many years without anybody to talk to. But sex? In my condition? No, I don't think so.</i>\"<br><br>");
                    outputText("Despite her refusing the prospect of sex, she happily takes a seat on a toppled column and invites you to join her.<br><br>");
                    //[/ Go to random [Conversation]]
                    doNext(AmilyScene.amilyConversationStart);
                }
                //[Medium Affection]
                else if (gameFlags[AMILY_AFFECTION] < 40) {
                    outputText("She blinks in surprise. \"<i>The talk would be wonderful... but do you really want to have sex with me when I look like this? It gets kind of lonely around here without you, but isn't this,</i>\" she loudly claps her hand against her belly and continues, \"<i>Something of an obstacle? I mean, I don't know how we'd actually make it work.</i>\"<br><br>");
                    outputText("You are forced to concede that you don't have any real ideas how sex between you would work with her in her current state.<br><br>");
                    outputText("Amily smiles and pulls up a seat on a mound of leaf litter. \"<i>That's all right; you meant well. And even if we can't have sex, we can still talk. Anything on your mind in particular?</i>\"<br><br>");
                    //[/ Go to random [Conversation]]
                    doNext(AmilyScene.amilyConversationStart);
                }
                //[High Affection]
                else {
                    outputText("She grins at you playfully. \"<i>It's just wonderful to finally have somebody to talk to after all these years. And maybe I'll let you make love to me afterwards, if you're a good listener.</i>\"<br><br>");
                    outputText("She waddles over to something that – in the distant past – might have been a stone seat for public convenience, and seats herself upon it heavily. \"<i>So, what do you want to talk about?</i>\" she asks.<br><br>");
                    //[/ Go to random [Conversation], then to [High Affection Sex – Heavily Pregnant Sex]]
                    doNext(AmilyScene.talkToAmilyWithSexAfter);
                }
                break;
            default: //Amily is not pregnant
                //[Low Affection]
                if (gameFlags[AMILY_AFFECTION] < 15) {
                    outputText("\"<i>...Well, maybe you're not like everyone else in this world after all,</i>\" she finally answers. Though she walks away without a second word, she seems rather pleased by your answer.<br><br>");
                    outputText("\"<i>Hey, hurry up!</i>\" she calls back over her shoulder. You snap out of your musings and follow her.");
                    //[/ Go to random [Conversation], then to [Low Affection Sex]]
                    doNext(AmilyScene.talkToAmilyWithSexAfter);
                }
                //[Medium Affection]
                else if (gameFlags[AMILY_AFFECTION] < 40) {
                    outputText("She smiles at you. \"<i>Well... I was feeling a little tired, a little lonely, and... maybe a little horny. Why not?</i>\"<br><br>");
                    outputText("She crooks a finger at you as a gesture to follow her.<br><br>");
                    //[/ Go to random [Conversation], then to [Medium Affection Sex]]
                    doNext(AmilyScene.talkToAmilyWithSexAfter);
                }
                //[High Affection]
                else {
                    outputText("\"<i>Conversation with a wonderful friend, and a wonderful bout of lovemaking afterwards... Well, I guess that's what passes for true romance in this crazy, messed up world these days,</i>\" Amily notes. She tries to sound lighthearted, but you know her well enough to sense the tinge of pain and loss in her words. Undaunted, she starts to walk off, gesturing you to follow. \"<i>Come on; I can talk and walk at the same time, surely you can do the same?</i>\"<br><br>");
                    //[/ Go to random [Conversation], then to [High Affection Sex]]
                    doNext(AmilyScene.talkToAmilyWithSexAfter);
                }

        }
    };

// Switcher for Talk Then Sex - COMPLETE
    AmilyScene.talkToAmilyWithSexAfter = function () {
        sexForced = true;
        AmilyScene.amilyConversationStart();
    };


    /*******
     *
     * Sex Scenes Start
     *
     ********/

//MALE

// Kicks off the male sex paths - NEEDS SPRITE IMAGE AND PLAYER COCK TESTING AND PREGNANCY EVENTS TO FINISH
    AmilyScene.amilySexHappens = function () {
        clearOutput();

        //var x = player.cockThatFits(61);
        //If too big
        //if (x == -1 && player.hasCock()) {
        //   outputText("Amily looks between your legs and doubles over laughing, \"<i>There is no way that thing is fitting inside of me!  You need to find a way to shrink that thing down before we get in bed!</i>\"");
        // Incredulous cock makes Amily less affectionate!
        //   gameFlags[AMILY_AFFECTION]--;
        //    doNext(Camp.returnToCampUseOneHour);
        //	}
        // Sex for the First time
        //else
        if (gameFlags[AMILY_FUCK_COUNTER] == 0) {
            gameFlags[AMILY_FUCK_COUNTER]++;
            AmilyScene.amilySexFirstTime();
        }

        //Low Affection Sex Path:
        if (gameFlags[AMILY_AFFECTION] < 15) {
            outputText("Amily's efforts at leading you through the ruined village are brisk and efficient. You don't really think she's looking forward to doing this all that much. No, that might be overstating things. It's more like she's under the impression that, details aside, this encounter between the two of you will be pure business.<br><br>");

            outputText("It's hard for you to say if you were led by a different route this time, but soon you are in what Amily has to offer for a private bedchamber, and she begins to reach for her clothes, obviously expecting you to do the same thing.<br><br>");
            menu();
            addButton(0, "Business", AmilyScene.amilySexBusiness, null, null, null, "Let's get down to business. We're on a mission...");
            addButton(1, "Play First", AmilyScene.amilySexPlaytimeFirst, null, null, null, "Must we rush? A little play would make it much more enjoyable...");
        }


        //Moderate Affection Sex:
        else if (gameFlags[AMILY_AFFECTION] < 40) {
            outputText("Amily leads you to her nest as quickly as ever, but things are a little different this time. You can tell Amily has what can only be described as a 'spring in her step'. She moves just a little bit quicker, she seems more enthusiastic about the prospect - her tail even waves slowly from side to side, a bit of body language you haven't seen from her before. And you're certain there's a bit of a seductive wiggle to her hips - which you definitely haven't seen from her before.");

            //(If Amily is Slightly Pregnant:
            if (AmilyScene.amilyPregnancy.pregnancyEventCounter >= 1 && AmilyScene.amilyPregnancy.pregnancyEventCounter <= 5) outputText("  However, she does sometimes touch the swell signifying the litter growing inside her, and when she does her attitude becomes uncertain and nervous.");

            outputText("<br><br>");

            outputText("Once you are inside, Amily gently tries to push you onto the bedding where you will be mating. Once you are seated, she smiles at you with a teasing expression and begins to slowly strip herself off, clearly trying to make the act seem as erotic as possible.");

            if (AmilyScene.amilyPregnancy.pregnancyEventCounter >= 6) outputText("  However, her confidence visibly slips when she has to fully bare the bulging belly that marks her pregnant state, but she musters the confidence and starts to show it off for you as well.");
            addButton(0, "Step In", AmilyScene.amilySexStepIn, null, null, null, "Why not let me do that for you?");
            addButton(1, "Watch Show", AmilyScene.amilySexEnjoyShow, null, null, null, "She's getting better at this...");
            //
        } else { // High Affection
            if (AmilyScene.amilyPregnancy.pregnancyEventCounter >= 6) AmilyScene.fuckAmilyPreg();
            //else
            AmilyScene.amilyHighAffectionSex();
        }


    };

// Switches sex scenes with Amily depending on gender, pregnancy, and other things - NEEDS LOTS OF WORK TO FINALIZE
    AmilyScene.determineAmilySexEvent = function () { // May need to force a false boolean to determine if sex is forced
        // Set the sex variable to none
        var sex = null;
        // Assume Amily isn't forcing you to fuck her.
        //var forced = false;
        // If sex isn't forced and the player isn't horny enough to fuck, jump out of loop

        // FEMALE SCENES
        /*
         //If Amily is lesbo lover!
         if (gameFlags[AMILY_CONFESSED_LESBIAN] > 0 && player.gender == 2) {
         if (gameFlags[AMILY_WANG_LENGTH] > 0) {
         //If not pregnant, always get fucked!
         if (!amilyPregnancy.isPregnant) sex = hermilyOnFemalePC;
         //else 50/50
         else {
         if (rand(2) == 0) sex = girlyGirlMouseSex;
         else sex = hermilyOnFemalePC;
         }
         }
         //LESBO LUVIN!
         else sex = girlyGirlMouseSex;
         }
         */
        // HERM SCENES
        /*
         //If Amily is a herm lover!
         if (player.gender == 3 && gameFlags[AMILY_HERM_QUEST] == 2) {
         //Amily is herm too!
         if (gameFlags[AMILY_WANG_LENGTH] > 0) {
         //If Amily is not pregnant
         if (!pregnancy.isPregnant) {
         //If PC is also not pregnant, 50/50 odds
         if (!player.isPregnant()) {
         //Herm Amily knocks up PC
         if (rand(2) == 0) sex = hermilyOnFemalePC;
         //PC uses dick on amily
         else {
         if (forced) sex = amilySexHappens;
         else sex = sexWithAmily;
         }
         }
         //If PC is preg, knock up amily.
         else {
         if (forced) sex = amilySexHappens;
         else sex = sexWithAmily;
         }

         }
         //Amily is preg
         else {
         //Pc is not
         if (!player.isPregnant()) sex = hermilyOnFemalePC;
         //PC is preg too!
         else {
         //Herm Amily knocks up PC
         if (rand(2) == 0) sex = hermilyOnFemalePC;
         //PC uses dick on amily
         else {
         if (forced) sex = amilySexHappens;
         else sex = sexWithAmily;
         }
         }
         }
         }
         //Amily still girl!
         else {
         //Not pregnant? KNOCK THAT SHIT UP
         if (!pregnancy.isPregnant) sex = sexWithAmily;
         //Pregnant?  Random tribbing!
         else {
         //Lesbogrind
         if (rand(2) == 0) sex = girlyGirlMouseSex;
         //Fuck!
         else {
         if (forced) sex = amilySexHappens;
         else sex = sexWithAmily;
         }
         }
         }
         }
         */

        // MALE SCENES - CHECK THESE TWO SCENES

        if (player.gender == 1) {
            //if (forced == true) amilySexHappens();
            //else
            AmilyScene.sexWithAmily();
        }

    };


// Amily response to you proposing sex in later meetings - NEEDS SPRITE AND PREGNANCY EVENTS TO FINISH
    AmilyScene.sexWithAmily = function () {
        clearOutput();

        outputText("You tell Amily that you came here because you wanted to have sex with her.<br><br>");


        switch (AmilyScene.amilyPregnancy.pregnancyEventCounter) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5: //Amily is slightly pregnant
                //[Low Affection]
                if (gameFlags[AMILY_AFFECTION] < 15) {
                    outputText("She stares at you, puzzled. \"<i>Why? I'm already pregnant,</i>\" she tells you. \"<i>...Forget it. You can have sex when I need to get pregnant again. Go find a goblin if you want to fuck some brainless baby-stuffed whore!</i>\"<br><br>");
                    outputText("Amily can still move quickly despite her pregnancy, and you are very promptly left all alone. Perhaps it would be better not to broach the subject that bluntly with her while she's in this state.<br><br>");
                    //Reduce affection. DERP
                    gameFlags[AMILY_AFFECTION] -= 3;
                    doNext(Camp.returnToCampUseOneHour);
                }
                //[Medium Affection]
                else if (gameFlags[AMILY_AFFECTION] < 40) {
                    outputText("She is clearly surprised, putting a hand to her swelling midriff. But then she shrugs and says, \"<i>Well, I guess I do owe you that much for helping me.</i>\"<br><br>");
                    outputText("Though she does set off and indicate for you to follow, you realize that she's not too happy about your reason for being here.<br><br>");
                    //[/ Go to [Medium Affection Sex]]
                    doNext(AmilyScene.amilySexHappens);
                }
                //[High Affection]
                else {
                    outputText("\"<i>You still want me, even though I'm already pregnant?</i>\" she asks – not angry or disappointed, but sounding rather pleased. \"<i>Well, how can I say no to you?</i>\" She smiles broadly and begins to walk away, doing her best to give you a sexy wiggle of her hips as an invitation for you to follow her.<br><br>");
                    //[/ Go to [High Affection Sex]]
                    doNext(AmilyScene.amilySexHappens);
                }
                break;
            case 6:
            case 7: //Amily is heavily pregnant
                //[Low Affection]
                if (gameFlags[AMILY_AFFECTION] < 15) {
                    outputText("Her disbelief is quite obvious. She stares at her belly, then at you, then at your crotch, then back at her belly again. She shakes her head, clearly looking disgusted. \"<i>What kind of sicko are you? Look at the state of me – I'm in no shape to have sex! Come back after I've given birth, if that's all I mean to you!</i>\"<br><br>");
                    outputText("Annoyed, she turns and waddles off. You do not give chase; you can tell that you've offended her.<br><br>");
                    //Reduce affection
                    gameFlags[AMILY_AFFECTION] -= 3;
                    doNext(Camp.returnToCampUseOneHour);
                }
                //[Medium Affection]
                else if (gameFlags[AMILY_AFFECTION] < 40) {
                    outputText("She boggles as if she can't believe you. \"<i>You can't be that desperate you'd want somebody as fat and knocked up as I am!</i>\" she protests.<br><br>");
                    outputText("You insist to her that you're not joking – you really do think she's sexy enough to make love to.<br><br>");
                    outputText("\"<i>...Well, I guess I'm flattered, but... do you have the faintest idea how to make love to a woman who is pregnant? Especially one as far along as I am?</i>\"<br><br>");
                    outputText("You are forced to concede that, actually, you don't.<br><br>");
                    outputText("\"<i>It's not that I don't like you, " + player.short + ", it's just... well, I don't feel comfortable doing that,</i>\" she explains apologetically.<br><br>");
                    outputText("You apologize back for confronting her with something she's uncomfortable with, and leave for your own camp, lest you insult her seriously.");
                    gameFlags[AMILY_AFFECTION] -= 3;
                    doNext(Camp.returnToCampUseOneHour);
                }
                //[High Affection]
                else {
                    outputText("She looks a little puzzled by the request, but then smiles with sincere pleasure. \"<i>I'm game if you are, dear.</i>\" She winks and offers her hand to you. You take it, and let her lead you to her chosen nesting site.<br><br>");
                    //[/ Go to [High Affection - Heavily Pregnant Sex]]
                    doNext(AmilyScene.amilySexHappens);
                }
                break; // do we need this?
            default: //Amily is not pregnant

                //[Low Affection]
                if (gameFlags[AMILY_AFFECTION] < 15) {
                    outputText("\"<i>Of course you did. Well, come on, I guess I can oblige you. It's the only way I'm going to get pregnant.</i>\"<br><br>");
                    outputText("She sets off, clearly leading the way as you follow her.<br><br>");
                    //[/ Go to [Low Affection Sex]]
                    doNext(AmilyScene.amilySexHappens);
                }
                //[Medium Affection]
                else if (gameFlags[AMILY_AFFECTION] < 40) {
                    outputText("\"<i>Well, I guess you'll do. I mean, I still need to get pregnant,</i>\" she teases you, tail waving merrily. \"<i>Follow me.</i>\"<br><br>");
                    outputText("You have to push yourself to keep up with her, but she's clearly just playing with you by moving so quickly rather than seriously trying to escape you.<br><br>");
                    //[/ Go to [Medium Affection Sex]]
                    doNext(AmilyScene.amilySexHappens);
                }
                //[High Affection]
                else {
                    outputText("Amily doesn't bother to say anything; she just grins like the cat that ate the canary (well, the mouse that ate the cheesecake, anyway). She grabs hold of your hand and does her best to pull you as fast as she can towards her closest bolt-hole.<br><br>");
                    //[/ Go to [High Affection Sex]]
                    doNext(AmilyScene.amilySexHappens);
                }
        }
    };


        /******
         / Male Low Affection Amily Sex Path
         ******/

// Low Affection Section 1 Choice 1 - NEED SPRITE TO FINISH
        AmilyScene.amilySexBusiness = function () {
            clearOutput();

            outputText("Allowing Amily to take care of her clothes, you hastily remove your own " + player.armorName + ". Once the two of you are naked in front of each other, Amily looks you up and down, and then sniffs - not in disdain, but honestly trying to get a good scent of you. You speculate that this is some kind of check to see that you haven't somehow managed to become corrupted since last you met.<br><br>");
            AmilyScene.amilySexPtII();
        };

// Low Affection Section 1Choice 2 - NEED SPRITE TO FINISH
        AmilyScene.amilySexPlaytimeFirst = function () {
            clearOutput();

            outputText("As Amily begins reaching for her clothes, rather than start stripping off yourself, you close the distance between the two of you and take hold of her hands.<br><br>");

            outputText("\"<i>W-What are you doing?</i>\" She asks, curious and a little wary.<br><br>");

            outputText("You simply smile back at her, and then gently begin to undress her, stopping her from lifting a finger to take off her clothes as you playfully remove them for her. At least, as playfully as you can, given how simple her garb is. The mouse-girl is confused, and she blushes a bit, but you think she's enjoying the attention, and you take this as an opportunity to gently scratch the base of her tail and tickle the rim of her ears with your fingers, the latter of which makes her giggle despite herself. Once she is standing nude before you, you begin to take off your own clothes. However, to your surprise, it is her turn to stop you.<br><br>");

            outputText("\"<i>Fair is fair.</i>\" She growls, but she's blushing faintly. Clumsy with unfamiliarity, she nonetheless does her best to remove your " + player.armorName + " in as erotic a fashion as she can manage, and you catch her nimble little fingers hesitantly stroking across the more interesting parts of your anatomy more than once. When you stand before her naked, she carefully looks you over and takes several deep breaths through her nose.<br><br>");

            outputText("\"<i>Just making sure that you haven't... you know, picked up something you shouldn't.</i>\" She explains softly.<br><br>");
            player.changeLust(5);
            AmilyScene.amilySexPtII();
        };

// Low Affection Section 2 - NEED SPRITE AND WORM FUNCTIONS TO FINISH
        AmilyScene.amilySexPtII = function () {


            //worm infested reaction
            /*
             if (player.findStatusEffect(StatusEffects.Infested) >= 0) {
             outputText("\"<i>EWWWW!  You're infested!</i>\" she shrieks, \"<i>Get out!  Don't come back 'til you get rid of the worms!</i>\"\n\nYou high tail it out of there.  It looks like Amily doesn't want much to do with you until you're cured.");
             doNext(camp.returnToCampUseOneHour);
             gameFlags[AMILY_AFFECTION] -= 3;
             gameFlags[AMILY_GROSSED_OUT_BY_WORMS] = 1;
             return;
             }
             */
            outputText("Now that both of you are naked, Amily takes a step back from you and begins to stroke herself - though her gestures are a little hesitant, and she clearly has never done this before, she is sincerely trying to be arousing. A finger strokes each dainty little nipple, circling around in opposite directions in order to make them perk as hard as they can. Her right hand slips away, leaving her left hand to alternate between each nipple as her nimble fingers begin to tease her most private of places. She may not be extraordinarily skilled at it, but she's definitely doing a good job of turning you on - particularly with the cute little gasp she makes when she pinches her clitoris a bit too hard.<br><br>");
            menu();
            addButton(0, "Sit & Watch", AmilyScene.amilySexSitAndWatch, null, null, null, "Awww, she's putting on a show! Let's see what she does next...");
            addButton(1, "Caress Her", AmilyScene.amilySexCaressHer, null, null, null, "Maybe I could show her how it's done?");

        };

// Low Affection Section 2 Choice 1 - NEED SPRITE
        AmilyScene.amilySexSitAndWatch = function () {
            clearOutput();

            var x = player.cockThatFits(61);
            outputText("You stay right where you are, not wanting to spoil the show. By the time that she is visibly starting to drip girlcum and approaches you, clearly ready to move on to the main event, your " + player.cockDescript(x) + " is iron-hard.<br><br>");
            // 50? Really? Seems excessive!
            player.changeLust(50);
            AmilyScene.amilySexPartIII();
        };

// Low Affection Section 2 Choice 2 - NEED SPRITE
        AmilyScene.amilySexCaressHer = function () {
            clearOutput();

            outputText("Watching Amily masturbate and tease herself in front of you is definitely erotic... but you want something more to this session than that. Licking your lips with a combination of arousal and nervousness, you tentatively reach out one hand and brush a feather-light touch against her fingers.  Her eyes, which she had previously been keeping closed, suddenly spring open, and you ready yourself to withdraw and apologize if she protests. But, for whatever reason, she does not protest and, emboldened, you continue to touch and caress her. You keep your touches gentle, light and restricted to non-intimate regions, but she seems to be enjoying this; she draws a little closer, and reaches out to brush your cheek, absentmindedly using the very hand she had been stroking her netherlips with before, and so the scent of her intimate regions drifts to your nostrils from where her fingers lay. Her eyes have rolled almost completely shut, the gaze she is giving you is a very languid one, but something about the set of her lips, only just starting to open, entices you to kiss them.<br><br>");
            addButton(0, "Refrain", AmilyScene.amilySexRefrainKiss, null, null, null, "Do I really want to take it that far? Maybe I shouldn't...");
            addButton(1, "Kiss Her", AmilyScene.amilySexKiss, null, null, null, "Maybe I could show her how it's done?");
        };

// Low Affection Section 2 Choice 2.1 - NEED SPRITE
        AmilyScene.amilySexRefrainKiss = function () {
            clearOutput();

            outputText("You pull your mind back from that thought. That's taking things in directions you're not sure that either you or Amily are actually comfortable with.<br><br>");
            // Affection hit!
            gameFlags[AMILY_AFFECTION] -= 3;
            AmilyScene.amilySexPartIII();
        };

// Low Affection Section 2 Choice 2.2 - NEED SPRITE
        AmilyScene.amilySexKiss = function () {
            clearOutput();

            outputText("Slowly, doing your best to convey that you will stop or back away if Amily is uncomfortable with this, you press your lips tenderly to Amily's.");
            if (gameFlags[AMILY_NOT_FURRY] == 0) outputText("  It's quite an unusual experience; though her lips proper are as naked as your own, there is fur around them, soft and fine and just close enough to tickle the edges of your own lips, to say nothing of the unusual sensation of kissing someone with a muzzle.  Amily doesn't seem bothered at all. In fact, she kisses you back, and quite eagerly so, too.<br><br>");
            else outputText("<br><br>");
            player.changeLust(5);
            gameFlags[AMILY_AFFECTION] += 1 + rand(3);
            AmilyScene.amilySexPartIII();
        };

// Low Affection Section 3 (final) - NEED SPRITE AND PLAYER COCK TO FINISH
        AmilyScene.amilySexPartIII = function () {
            var x = player.cockThatFits(61);

            //outputText(images.showImage("amily-forest-plainfuck"), false);
            outputText("The time couldn't be any more right for either of you, and you both sink onto the bedding that Amily has prepared. Lying side by side, Amily guides you with surprising efficiency into her entry, and then, once you are comfortably inside, she begins to thrust, her cunt gripping your " + player.cockDescript(x) + " like a vice.<br><br>");

            /*(If player chooses "Share The Pleasure":)
             {
             outputText("Determined to make this good for Amily too, you resume stroking and caressing her, doing your best to meet her thrusts with your own, and planting the odd kiss on the nape of her neck");
             //([horsecock]
             if (gameFlags[AMILY_NOT_FURRY]==0)
             outputText(" - not actually an unpleasant experience, despite the fur");
             outputText(". She is surprised, and tenses warily at first, but then melts under your ministrations, squeaking softly in her appreciation of your efforts.");
             }
             */

            outputText("But all good things must come to an end, and soon you both build to a mutual climax. Once you have regained your strength, you stop holding each other and begin to dress, ready to go your separate ways once more. At the door, though, Amily stops you.<br><br>");

            outputText("\"<i>Thank you, that was... nice...,</i>\" the little mousegirl says with a blush. \"<i>Maybe... we can... do it again?</i>\"<br><br>");

            outputText("She seems surprised that she actually enjoyed it (at least a little), but she's definitely willing to repeat the experience. You assure her that you'll come back, and then resume your travels.");
            //Knock up, PC stats, etc.
            gameFlags[AMILY_FUCK_COUNTER]++;
            AmilyScene.amilyPreggoChance();
            //Slight affection gain?
            gameFlags[AMILY_AFFECTION] += 1 + rand(2);
            player.orgasm();
            player.modStats("sen", -1);
            doNext(Camp.returnToCampUseOneHour);
        };

        /**********
         * Male Medium Affection Amily Sex Path
         ***********/

// NEED SPRITE
        AmilyScene.amilySexStepIn = function () {
            clearOutput();

            outputText("Eager, confused and feeling impatient, you rise from your seat to help Amily undress. She accepts your help, and does seem to enjoy your touches and help, but at the same time she seems disappointed... maybe even a little hurt? Almost as if she had been wanting you to watch her efforts?<br><br>");
            AmilyScene.amilySexMidPartII();
        };

// NEED SPRITE AND PREGNANCY EVENTS
        AmilyScene.amilySexEnjoyShow = function () {
            clearOutput();

            outputText("Surprised, curious and aroused in equal measures, you decide to sit back and watch the show. Amily seems very happy to perform for you, and does her best to make it as intriguing as possible.");
            if (AmilyScene.amilyPregnancy.pregnancyEventCounter >= 6) outputText("  Even though she was clearly a little nervous about her gravid state in the beginning, as she continues, she grows in confidence to the point it seems she has almost forgotten about it.");
            outputText("<br><br>");
            AmilyScene.amilySexMidPartII();
        };

// NEED SPRITE
        AmilyScene.amilySexMidPartII = function () {
            player.changeLust(5);

            outputText("By the time Amily is completely naked, she is clearly excited about what is coming up; you even think she's wet already. She stares at you with a mischievous, turned-on smile, waiting to see what you will do now that it is your turn to strip.<br><br>");
            outputText("Do you do a striptease of your own or just strip naked and get to business?");
            addButton(0, "Striptease", AmilyScene.amilySexYouStrip, null, null, null, "Two can play at this game. Let's see if she likes a striptease...");
            addButton(1, "Business", AmilyScene.amilySexGetTheFunStarted, null, null, null, "She doesn't need to tease you anymore to get you going! Let's get to the fun part...");
        };

// NEED SPRITE
        AmilyScene.amilySexYouStrip = function () {
            clearOutput();

            var x = player.cockThatFits(61);
            outputText("It is your turn to give her a mischievous smile back. Feeling turned on and excited, and remembering the elders in the village telling you that fair is only fair, you decide to give her a little show of her own. Standing up, you tilt your head back and thrust out your chest, trying to look enticing. As Amily watches, at first bemused and then pleased, you slowly strip off your " + player.armorName + ", working hard to make it as sensual and suggestive as possible. You show off your body for her, leisurely stroking your own limbs and down your midriff to finally reveal that which lies inside your pants; your " + player.cockDescript(x) + ". Amily is definitely appreciative of the show.<br><br>");
            AmilyScene.amilySexMidPartIII();
            //continueWithMoreMidLevelAmilySex();
        };

// NEED SPRITE, PLAYER VARIABLE CHECK, PLAYER COCK
        AmilyScene.amilySexGetTheFunStarted = function () {
            clearOutput();

            var x = player.cockThatFits(61);
            outputText("Too horny to think of anything else than what lies ahead, you hastily remove your " + player.armorName + ".  Amily smiles at what she can see, enjoying the sight of your body and your " + player.cockDescript(x) + "<br><br>");
            AmilyScene.amilySexMidPartIII();
            //continueWithMoreMidLevelAmilySex();
        };

// NEED SPRITE
        AmilyScene.amilySexMidPartIII = function () {
            player.changeLust(5);

            outputText("Once you are both naked, you embrace and begin with a deep kiss. Slowly you both sink down and start exploring each other's bodies. You feel Amily's hands caressing you while you lightly kiss her breasts, one of your hands slowly drifting down to her cute ass and lightly squeezing it. Looking into her eyes, you see a sparkle in them before she surprises you and somehow manages to turn you onto your back. Now she's sitting on your belly, with your already hard cock being fondled by her rather flexible tail. Grinning at you, she seems to plan on teasing you as long as possible before allowing you to enter her.<br><br>");
            addButton(0, "Play Along", AmilyScene.amilySexPlayAlong, null, null, null, "Tooltip to be added");
            addButton(1, "Please Her", AmilyScene.amilySexWorkToPlease, null, null, null, "Tooltip to be added");

        };

// NEED SPRITE
        AmilyScene.amilySexPlayAlong = function () {
            outputText("", true);

            //outputText(images.showImage("amily-forest-reverse-cowgirl"), false);
            outputText("You decide to let her take the dominant position, relax (as much as you can with a beautiful, hot and very wet little mouse-girl sitting on you and fondling you) and simply enjoy her attentions. Amily obviously knows what she is doing - though you have no idea HOW she knows - and manages to bring you nearly to the climax before drawing back a little and letting you calm down.  She repeats this several times until you're nearly going crazy.  Just when you think you can't stand it anymore, she removes her tail from your cock and instead uses it to lightly bind your hands. You could easily move your hands, but decide not to. Grinning at you, she hovers a moment over your cock before slowly sinking down. You somehow manage to avoid cumming as soon as you enter her, but it's really, really hard. Amily's tail draws your 'bound' hands onto her breasts, while hers start caressing yours as she begins slowly riding you. Soon, the speed increases, and it isn't long before you both orgasm.<br><br>");
            player.orgasm();
            player.modStats("sen", -1);
            AmilyScene.amilySexMidPartIV();
        };

// NEED SPRITE
        AmilyScene.amilySexWorkToPlease = function () {
            clearOutput();

            outputText("You decide to take a more active role and start caressing her, kneading her breasts and making sure she enjoys it just as much as you do. Soon, Amily can't hold herself back and sinks down on you, beginning to ride you for all she's worth. It doesn't take you two long to reach the climax.<br><br>");
            player.orgasm();
            player.modStats("sen", -1);
            AmilyScene.amilySexMidPartIV();
        };

// NEED SPRITE, POSSIBLE AFFECTION GAIN
        AmilyScene.amilySexMidPartIV = function () {

            outputText("Quite spent from your lovemaking, Amily sinks down on your breast, smiles at you and slowly dozes off. You also drift off to sleep soon after. Some time later, you wake up to find her already putting on her clothes again.<br><br>");
            //Affection gain here?
            AmilyScene.amilyPreggoChance();
            gameFlags[AMILY_AFFECTION] += 3 + rand(4);
            gameFlags[AMILY_FUCK_COUNTER]++;
            menu();
            addButton(0, "Say Goodbye", AmilyScene.amilySexSayGoodbye, null, null, null, "Tooltip to be added");
            addButton(1, "Stay Awhile", AmilyScene.amilySexStayAwhile, null, null, null, "Tooltip to be added");

        };

// NEED SPRITE
        AmilyScene.amilySexSayGoodbye = function () {

            clearOutput();
            outputText("You smile at her and give her a kiss before saying goodbye and returning to your camp.");
            doNext(Camp.returnToCampUseOneHour);
        };

// NEED SPRITE
        AmilyScene.amilySexStayAwhile = function () {

            clearOutput();
            outputText("You decide you'd rather stay with her a little longer, so you get up, go to her and with a kiss and some caresses draw her down again. She doesn't really put up any resistance, so you both lie there kissing and caressing each other for some time before you finally say goodbye and return to your camp.");
            //Bonus affection mayhapz?
            gameFlags[AMILY_AFFECTION] += 3;
            doNext(Camp.returnToCampUseOneHour);
        };

        /**********
         * Male High Affection Amily Sex Path
         **********/

//[High Affection - Non-Pregnant/Slightly Pregnant] -- NEED SPRITE, PREGNANCY, PLAYER COCK
        AmilyScene.amilyHighAffectionSex = function () {


            var x = player.cockThatFits(61);
            outputText("Amily really didn't waste any time getting to her hidden bedroom, sprinting as fast as she could with you in tow.");

            if (AmilyScene.amilyPregnancy.isPregnant) outputText("  Even in a slightly pregnant state, she goes surprisingly fast, though she's also rather cautious of her small bump.");
            outputText("<br><br>");

            outputText("Once inside, the two of you get to work undoing each others clothes, tossing the garments across the room with little care for them. Amily bites her lower lip as she examines your naked form again, before practically jumping you. She wraps her small hands around your stiff " + Appearance.cockNoun(player.cocks[x].cockType) + " in an almost painful fashion, rubbing and teasing it, and presses her mouth against yours, her tongue exploring every inch of your mouth that it can reach, and you quickly respond by doing the same favor for Amily.");

            if (AmilyScene.amilyPregnancy.isPregnant) outputText("  Really it seems the only thing between you two now is Amily's small stomach bulge.");

            //(If Amily is herm:
            if (gameFlags[AMILY_WANG_LENGTH] > 0) outputText("  You can feel her erection, hot and solid, pressed between your two bodies.");
            outputText("<br><br>");

            outputText("Not releasing her grip on your raging erection, or breaking the passionate kiss for even a single second, she moves back toward the bed and takes you with her. You're quite surprised that the quiet mousegirl has come out of her shell and is being so forward. Is this the effect you have on her?<br><br>");

            outputText("Finally putting some distance between the two of you, Amily flops back onto the bed and places her hands behind her head, presenting her beautiful body to you. Finding the sight irresistible, you move your head between her legs and start licking at her moist vag, pushing your tongue or your fingers in every once in a while, and ");

            if (gameFlags[AMILY_WANG_LENGTH] == 0) outputText("sucking on her sensitive clit");
            else outputText("licking and kissing her human-like cock");

            outputText(" to stimulate her further. In response, Amily moans loudly and spreads her legs further apart, an invitation to continue. You happily oblige your lover, burying two fingers into her wet cunt while you move to other parts of her body.");
            if (AmilyScene.amilyPregnancy.isPregnant) outputText("  As you move your head across her beautiful form, you stop at her growing baby bump and give it a small kiss.");
            outputText("  Your head hovers at her breasts");
            if (AmilyScene.amilyPregnancy.isPregnant) outputText(", which seem to have grown from the pregnancy,");

            outputText(" and get to work licking and suckling her nipples, rubbing the sensitive mounds.");
            if (AmilyScene.amilyPregnancy.isPregnant) outputText("  When you get a dribble of milk in your mouth it surprises you, but you certainly don't stop.  \"<i>Hah...You're going to have to teach the children how that's done,</i>\" Amily says, in between fevered breaths.");
            outputText("<br><br>");

            outputText("By the time you start teasing her neck and collarbone, Amily's hands are clinging onto your back and she's impatiently grinding against your raging erection.  \"<i>Please don't tease me anymore,</i>\" Amily whispers into your ear, making you almost feel a little bad for teasing your love in such a way.<br><br>");

            outputText("As an apology you quickly push your " + player.cockDescript(x) + " past her dampened nether-lips, and set to work thrusting in and out of your mousegirl lover.");

            if (AmilyScene.amilyPregnancy.isPregnant) outputText("  You are of course mindful of her baby bump, not going too fast and making sure you're in a position that's comfortable for the two of you, not wanting to harm your future offspring with the lovely mouse maiden.");

            outputText("  It's not too long before you're going at a regular pace, stuffing Amily's fuckhole with your familiar manhood.<br><br>");

            outputText("Amily moans from the pleasure and raises her hips up to meet your thrusts, desperate for more of your loving.  She whispers a few dirty things to you between shallow breaths, \"<i>");

            if (!AmilyScene.amilyPregnancy.isPregnant) outputText("Fill me up with everything you have... I want to be a mother for your children, just as much as I want to be a mother of my own people,");
            else outputText("No need to hold back, pump as much cum into me as you can,");

            outputText("</i>\" she whispers in a sultry tone, and her words are enough to send you over the edge. You grunt loudly, feeling as if your cock is about to explode from the exertion, blasting Amily so full of your cum that it starts to ooze out. Amily gives a cute little cry, and her vaginal walls clamp down on your sensitive member with enough force to make you wince as girlcum sprays out onto your thighs");
            //(if Amily is herm:
            if (gameFlags[AMILY_WANG_LENGTH] > 0) outputText(" and cum spurts into the air between you, splattering on you both");

            outputText("<br><br>");

            if (!AmilyScene.amilyPregnancy.isPregnant) outputText("\"<i>If that didn't knock me up... I don't care as much as you'd think. It was magnificent either way,");
            else outputText("\"<i>Hmm...My kids are pretty lucky that their father is such a virile specimen,");

            outputText("</i>\" Amily says as she catches her breath, reaching up to ruffle your hair. You give her a bashful smile, glad to see you've made her so happy.<br><br>");

            outputText("The two of you lie together for some time, and it's with great regret that you tell her that you need to check in on your own camp. Amily seems disappointed, not wanting you to leave, but understands why you need to go. \"<i>");

            if (!AmilyScene.amilyPregnancy.isPregnant) outputText("Okay... Well, I'm sure you'll be back. I will need your help again if this doesn't set,");

            else outputText("Okay dear...But you better come back some time. You don't want your children to have abandonment issues, do you?");

            outputText("</i>\" Amily says while rubbing her stomach. You smile at her and nod, promising you'll come back, before setting off for your own camp.");
            /*OLD
             outputText("Amily really didn't waste any time getting to her hidden bedroom, sprinting as fast as she could with you in tow.");
             if (gameFlags[AMILY_INCUBATION] > 0) outputText("  Even in a slightly pregnant state she goes surprisingly fast, though she's also rather cautious of her small bump.");
             outputText("<br><br>");

             outputText("Once inside, the two of you get to work undoing each others clothes, tossing the garments across the room with little care for them. Amily bites her lower lip as she examines your naked form again, before practically jumping you. She wraps her small hands around your stiff " + player.cockDescript(0) + " in an almost painful fashion, rubbing and teasing it, and presses her mouth against yours, her tongue exploring every inch of your mouth that it can reach, and you quickly respond by doing the same favor for Amily.");
             if (gameFlags[AMILY_INCUBATION] > 0) outputText("  Really it seems the only thing in-between you two now is Amily's small stomach bulge.");
             outputText("<br><br>");

             outputText("Not releasing her grip on your raging erection, or breaking the passionate kiss for even a single second, she moves back toward the bed and takes you with her. You're quite surprised that the quiet mousegirl has come out of her shell and is being so forward. Is this the effect you have on her?<br><br>");

             outputText("Finally putting some distance between the two of you, Amily flops back onto the bed and places her hands behind her head, presenting her beautiful body to you. Finding the sight irresistible, you move your head between her legs and start licking at her moist vag, pushing your tongue or your fingers in every once in a while, and sucking on her sensitive clit to stimulate her further. In response, Amily moans loudly and spreads her legs further apart, an invitation to continue. You happily oblige your lover, burying two fingers into her wet cunt while you move to other parts of her body.");
             if (flags[kFLAGS.AMILY_INCUBATION] > 0) outputText("  As you move your head across her beautiful form, you stop at her growing baby bump and give it a small kiss.");
             outputText("  Your head hovers at her breasts ");
             if (flags[kFLAGS.AMILY_INCUBATION] > 0) outputText("which seem to have grown from the pregnancy ");
             outputText("and get to work licking and suckling her nipples, and rubbing the sensitive mounds.");
             if (flags[kFLAGS.AMILY_INCUBATION] > 0) outputText("  When you get a dribble of milk in your mouth it surprises you, but you certainly don't stop \"<i>Hah... You're going to have to teach the children how that's done,</i>\" Amily says in between fevered breaths.");
             outputText("<br><br>");

             outputText("By the time you start teasing her neck and collarbone, Amily's hands are clinging onto your back and she's impatiently grinding against your raging erection. \"<i>Please don't tease me anymore...</i>\" Amily whispers into your ear, making you almost feel a little bad for teasing your love in such a way.<br><br>");

             outputText("As an apology you quickly push your " + player.cockDescript(0) + " past her dampened nether-lips, and set to work thrusting in and out of your mousegirl lover.");
             if (flags[kFLAGS.AMILY_INCUBATION] > 0) outputText("  You are of course mindful of her baby bump, not going too fast and making sure you're in a position that's comfortable for the two of you.  You don't want to harm your future offspring with the lovely mouse maiden.");
             outputText("  It's not too long before you're going at a regular pace, stuffing Amily's fuckhole with your familiar manhood.<br><br>");

             outputText("Amily moans from the pleasure and raises her hips up to meet your thrusts, desperate for more of your loving, whispering a few dirty things to you between shallow breaths \"<i>");
             //not preggo
             if (flags[kFLAGS.AMILY_INCUBATION] == 0) outputText("Fill me up with everything you have...I want to be a mother for your children, just as much as I want to be a mother of my own people...");
             else outputText("No need to hold back, pump as much cum into me as you can...");
             outputText("</i>\" she whispers in a sultry tone, and her words are enough to send you over the edge. You grunt loudly, feeling as if your cock is about to explode from the exertion, blasting Amily so full of your cum that it starts to ooze out. Amily gives a cute little cry, and her vaginal walls clamp down on your sensitive member with enough force to make you wince, as girlcum sprays out onto your thighs.<br><br>");

             //no preggo
             if (flags[kFLAGS.AMILY_INCUBATION] == 0) outputText("\"<i>If that didn't knock me up...I don't care as much as you'd think. It was magnificent either way,");
             else outputText("\"<i>Hmm...My kids are pretty lucky that their father is such a virile specimen,");
             outputText("</i>\" Amily says as she catches her breath, reaching up to ruffle your hair. You give her a bashful smile, glad to see you've made her so happy.<br><br>");

             outputText("The two of you lie together for some time, and it's with great regret that you tell her that you need to check in on your own camp. Amily seems dissapointed, not wanting you to leave, but understands why you need to go. \"<i>");
             //no pregg
             if (flags[kFLAGS.AMILY_INCUBATION] == 0) outputText("Okay...Well, I'm sure you'll be back. I will need your help again if this doesn't set,");
             else outputText("Okay dear... but you'd better come back some time. You don't want your children to have abandonment issues, do you?");
             outputText("</i>\" Amily says, rubbing her stomach. You smile at her and nod, promising you'll come back, before setting off for your own camp.");
             */
            //boost affection


            gameFlags[AMILY_AFFECTION] += 2 + rand(4);
            gameFlags[AMILY_FUCK_COUNTER]++;
            player.orgasm();
            player.modStats("sen", -1);
            AmilyScene.amilyPreggoChance();
            doNext(Camp.returnToCampUseOneHour);
        };


//High Affection - Very Pregnant
        AmilyScene.fuckAmilyPreg = function () {
            clearOutput();
            outputText("Amily leads you by the hand to her hiding place as quickly as possible... which is a relatively brisk walking speed. You don't rush her or anything, understanding how the heavy bump on her belly is slowing her down, moving side-by-side at the same pace.  You try to help Amily over the difficult terrain facing her.");
            if (gameFlags[AMILY_WANG_LENGTH] > 0) outputText("  The erection tenting her pants isn't helping.");
            outputText("<br><br>");

            outputText("Once inside the little safe spot you help Amily undress from her restrictive garments, getting a good grope at every sensual curve your hands roam over. It's only when Amily herself is fully undressed that you remove your own gear.<br><br>");

            outputText("Amily, as per usual, is quite pleased by your naked form but she herself is casting her gaze to the ground and blushing furiously. \"<i>Do you still think I'm pretty?</i>\" she asks you, and you waste no time telling her that she's more beautiful than ever now, her new curves are far more emphasised and certainly arousing to look at. Amily's expression brightens at that, and she hugs onto you as tightly as she can, declaring just how much she loves you. Your own feelings for her seem to be mutual.<br><br>");

            outputText("She pulls your head in, your lips locking in a passionate display, her hands tracing a line down to your chest until she's gently fondling your cock.  ");
//(If player has a tail)

            //CHECK THIS IF IT FAILS
            if (player.tailType > TAIL_TYPE_NONE) outputText("You even feel Amily wrap her mousy tail around your own, making you chuckle softly into your lovers mouth.  ");
            else outputText("A tickling sensation hits your body, making you snort and giggle, realising that Amily's tail is fondling your thigh.  ");
            outputText("Your eyes catch sight of Amily's swollen breasts, seeing a few drops of milk on her stiff nipples. You smirk and fondle her breasts, breaking the kiss every few moments to get a taste of her milk. Amily moans in response, tightening her grip on you every time your lips return to her own.<br><br>");

            outputText("Once she pulls her head back, a few strands of saliva still link the two of you.  She looks at you expectantly, wanting you to make the first move. You scratch the back of your head and look at her somewhat embarrassed, saying you don't really know what kind of position to use on a heavily pregnant woman. Amily giggles, squeaking a few times, her hands coming to rest on your shoulders \"<i>Alright, let me show you...</i>\" she says, positioning you on the bed, on your back.<br><br>");

            outputText("\"<i>I did some research on the matter, just in case you still wanted to make love while I'm like this... I'm pretty glad you do - you have no idea how horny I've been from this.</i>\" Amily says as she straddles your hips, feeling the extra weight that the cute little mouse-girl has put on. Nothing you can't handle, and certainly something you're not going to call attention to.<br><br>");

            //CHECK THIS TOO!
            outputText("Amily teases you for a little while, running her pussy-lips and tail along the tip of your erection a few times, earning a few moans and groans from you. Amily smirks slightly before sliding herself down your fully erect " + Appearance.cockNoun(CockTypesEnum.HUMAN) + ", taking as much as she can. You're a little worried that this might be harmful for your offspring, or worse - that they'll know what's going on... but Amily really seems to know more about this than you do, so you're just going to go along with her suggestions on the matter.<br><br>");

            outputText("Amily manages to keep a rather impressive rhythm and pace as she rides your cock like a mechanical bull. In time you manage to return her motions, thrusting your hips up to meet her and twisting yourself around counter-clockwise. The way Amily shrieks, or squeeks, in pleasure is a good sign, and as a result, you pick up speed with your gyrations. The intense pleasure makes you wish this session didn't have to end, but as you feel your orgasm rapidly approach, you sigh in defeat and resolve to make it a memorable one. You quickly clasp your hands around Amily's hips and pick up speed, making Amily gasp in surprise. You keep your motions up for another few minutes, before the two of you bring each other to a powerful simultaneous orgasm, mixed fluids drooling from Amily's thoroughly stretched cunt");
            if (gameFlags[AMILY_WANG_LENGTH] > 0) outputText(", her own mouse-cock spewing futa-cum all over her belly");
            outputText(".<br><br>");

            if (gameFlags[AMILY_WANG_LENGTH] > 0) outputText("\"<i>Remember when you said this cock was a bad thing?</i>\" you tease, causing Amily to blush and playfully punch you in the shoulder.  \"<i>Sh-shut up!  It's... it's pretty incredible, there, I said it.</i>\"<br><br>");

            outputText("With the two of you having finished your bout of lovemaking, you sit up and let Amily recline against your chest, letting your hands run along her beautiful bump. Amily smiles happily, her hands moving over your own and guiding them over her bulge. You smile happily as you feel your children kicking, which causes Amily to giggle slightly. The two of you sit together in silence for the remainder of your time together, feeling nothing but love for each other and the offspring you've managed to create. You see Amily smile warmly at you, with a hint of sadness on her face, with a question forming on her lips. She doesn't really say anything though, deciding not to ruin the quiet moment between the two of you.<br><br>");

            outputText("Eventually, with great sadness and regret, you leave your lover's side and head off back to camp, vowing to return.");
//boost affection
            gameFlags[AMILY_AFFECTION] += 2 + rand(4);
            gameFlags[AMILY_FUCK_COUNTER]++;
            player.orgasm();
            player.modStats("sen", -1);
            doNext(Camp.returnToCampUseOneHour);
        };

//FEMALE SEX

// First time and subsequent times. Some problems with this scene. See notes. - NEED SPRITE
        AmilyScene.girlyGirlMouseSex = function () {

            clearOutput();
            outputText("You take Amily by the hand and allow her to lead you to where it is she plans on having sex with you. Soon enough, through many twists and turns, you are in a makeshift bedroom in an otherwise gutted building.<br><br>");

            //(If first time:
            if (gameFlags[AMILY_TIMES_FUCKED_FEMPC] == 0) outputText("Amily stops and lets go of your hand, blushing faintly and looking embarrassed. \"<i>So, ah... how do we do this? I... I've never been attracted to another woman before, how does sex even work between us?</i>\"<br><br>");
            else outputText("\"<i>Remember how you had to take charge the first time?</i>\" She grins. \"<i>Care to see if you've still got it?</i>\"<br><br>");

            outputText("You smile at her, place a hand gently under her chin, and then draw her in closely. You kiss her, deeply and warmly, not trying to force anything but letting her be drawn into it of her own accord. As she starts to kiss you back, you gently reach into her shirt and begin to caress her small, tender breasts. As you stroke and tease the sensitive flesh, rubbing a thumb enticingly around each nipple, Amily moans, and her tail suddenly wraps convulsively around your " + player.leg() + ", making it quite clear that she's enjoying this and getting ready.<br><br>");

            outputText("Slowly you lead her to her bedding, and it is only when she is on her back that you break off the kiss. Amily looks dazed for a few moments, and then grins at you. \"<i>Wow.</i>\" You smile in response and start to remove your " + player.armorName + " - Amily sees this and hurriedly starts to pull off her own tattered rags. Once the two of you are naked, you give her one last kiss before you gently sit atop her, facing backwards. You slowly lie yourself down onto her, giving you a perfect view of her pink, naked pussy, and allowing her to come face to face with your own " + player.vaginaDescript(0) + ".<br><br>");

            if (gameFlags[AMILY_TIMES_FUCKED_FEMPC] == 0) outputText("\"<i>...I'm supposed to lick you there, right?</i>\" Amily asks, hesitantly. You smirk and promptly give her own sex a long, sloppy lick of your own. She squeaks in shock and then clumsily licks you in return.<br><br>");
            else outputText("Amily needs no instructions and plunges her tongue as deeply as it can go into your sex. You yelp in shock, which makes Amily's tail wave happily, and, grinning mischievously, you return the favor.<br><br>");

            outputText("You stroke her pussy's walls with your tongue as slowly and as intensely as possible, even as Amily licks you in return. Her taste begins to fill your mouth, the unmistakable taste of sex and girlcum. Amily does her best to mirror your actions; when you suck playfully on her little clit, Amily sucks on your own " + player.clitDescript() + ".  When you go faster, she goes faster, when you go slower, she goes slower.<br><br>");

            outputText("Her juices are flowing strong and thick, now, leaving you lapping at the wetness with audible slurps. Your tongue reaches into every crevice, every fold that you can find, and Amily moans and squeaks incoherently as she savors your ministrations. Emboldened, she suddenly thrusts her " + ((gameFlags[AMILY_NOT_FURRY] == 0) ? "muzzle" : "lips") + " into your " + player.vaginaDescript(0) + ", using her pointed nose as a phallic substitute to reach deeper and hit spots of yours that her tongue just isn't hitting strongly enough. You bite back your own squeal of pleasure, and start licking as hard as you can.<br><br>");

            outputText("Under such mininstrations, it is no surprise that, inevitably, both of you cum, leaving each other's faces splattered with your juices. Sighing with relief, you roll off of Amily's body and lay there in her bed, breathing heavily from your exertions.<br><br>");

            if (gameFlags[AMILY_TIMES_FUCKED_FEMPC] == 0) outputText("\"<i>...I didn't know it could feel so good with another woman.... But I was never attracted to women before.</i>\" Amily murmurs to herself.<br><br>");
            else outputText("\"<i>...Does it make me a lesbian, that I love this so much? Or am I just so lonely for company that even another woman is good?</i>\" Amily asks. Then she musters the energy to shake her head. \"<i>It doesn't matter. I love you.</i>\"<br><br>");

            outputText("Your own strength returning to you, you sit up and smile at your mousey lover before giving her a deep kiss, tasting your juices and letting her get a taste of her own. Then you redress yourself and return to your camp.");
            player.orgasm();
            gameFlags[AMILY_TIMES_FUCKED_FEMPC]++;
            doNext(Camp.returnToCampUseOneHour);
        };


// Amily turns Herm for you scenes.


// NEED SPRITE
        AmilyScene.amilyPostConfessionGirlRemeeting = function () {

            clearOutput();
            outputText("Amily looks happy to see you, as usual, but shy as well. \"<i>Ah... " + player.short + "... it's good to see you again.</i>\"<br><br>");

            outputText("You agree that it is, then ask if something is the matter.<br><br>");

            outputText("Amily scuffs the ground nervously. \"<i>It's like this... You know I love you, don't you? But that I also want - I *need* - to have children to resurrect my race?</i>\"<br><br>");

            outputText("You nod your agreement and ask her what exactly she means.<br><br>");

            outputText("She looks down at the ground, unable to meet your eyes, then pulls her tattered pants down to reveal something you never would have expected. A penis - a four inch long, surprisingly human-like penis, already swelling to erection. Blushing, she starts to speak, still not looking at you. \"<i>I... I thought that, if it's my idea and all, I should be the one to grow this thing... Please, I love you, I want to have children with you, can't we -</i>\"<br><br>");
            gameFlags[AMILY_WANG_LENGTH] = 4;
            gameFlags[AMILY_WANG_GIRTH] = 1;
            menu();
            addButton(0, "Accept", AmilyScene.acceptHermAmily, null, null, null, "Add Tooltip Later");
            addButton(1, "Reject", AmilyScene.denyHermAmily, null, null, null, "Add Tooltip Later");
        };


// Accept Herm Amily's offer - NEED SPRITE
        AmilyScene.acceptHermAmily = function () {

            clearOutput();
            outputText("Her increasingly nervous, high-pitched tone is cut off when you press a finger to her lips, smiling affectionately at her. You tell her that you understand what she is saying and why she did this, and you're happy to be with her in that way. Putting on a saucy grin, you stage-whisper into her ear about giving her new appendage a trial-run, and she blushes bright red.<br><br>");

            outputText("She still starts leading you away, though.");
            doNext(AmilyScene.amilyHermOnFemalePC);
        };


// Reject Amily Herm offer. Closes encounter off - NEED SPRITE
        AmilyScene.denyHermAmily = function () {

            clearOutput();
            outputText("You scowl and take a pointed step back. You cared about her because she was another woman, alone and lost in this twisted world full of horny freaks that seem to be nothing but dicks and lust; now she's turned herself into one of them? She couldn't accept the pure love that the two of you already had?<br><br>");

            outputText("Amily stops, her new cock wilting, her expression making it quite obvious that she's heartbroken. Her head falls, tears dripping from her eyes, and she turns and runs away. You glare after her as she vanishes, sobbing, into the ruins, hoping she never comes back.");
            //no more amily in village
            gameFlags[AMILY_VILLAGE_ENCOUNTERS_DISABLED] = 1;
            doNext(Camp.returnToCampUseOneHour);
        };

// NEED SPRITE, cuntChange FUNCTION, PLAYER DESC STUFF, PREGNANCY
        AmilyScene.amilyHermOnFemalePC = function () {

            clearOutput();
            outputText("Amily's efforts at leading you to a place to make love are a bit hampered by the erection tenting her pants, which she is clearly still having a bit of difficulty adjusting to. Finally, though, you have reached her current den, where you waste no time in removing your " + player.armorName + ".<br><br>");

            if (gameFlags[AMILY_HERM_TIMES_FUCKED_BY_FEMPC] == 0) outputText("\"<i>I can't believe this is actually happening... I've grown a cock and I'm about to use it on another woman.</i>\" Amily mutters to herself, though it's very evident that she likes what she sees, unable to resist staring at your " + player.chestDesc() + " or your " + player.vaginaDescript() + ".<br><br>");
            else outputText("\"<i>I still can't believe that I'm burying this hot, throbbing thing in another woman's pussy... More than that, I think I'm actually starting to like it.</i>\" Amily comments to herself, staring unabashedly at your curves.<br><br>");

            //(If first time & player is herm:
            if (player.gender == 3) {
                if (gameFlags[AMILY_HERM_TIMES_FUCKED_BY_FEMPC] == 0) outputText("\"<i>How on earth did I let myself get talked into this? If you've got both a cock and a pussy, then what's wrong with you just filling me with that cock?</i>\" Amily mutters to herself. Despite her words, though, her gaze is fixed squarely on your " + player.vaginaDescript() + ".<br><br>");
                //else
                else outputText("\"<i>You know, it's not all bad, us both being this way... but remember that I want a turn at that, too.</i>\" She states, staring hungrily at your " + player.multiCockDescriptLight() + ".<br><br>");
            }

            outputText("You smile at her, and indicate that she may want to remove her own clothing. Looking a bit embarrassed, Amily strips herself down, revealing her perky breasts and her straining, eager cock for your own perusal. You step close and reach out to gently stroke the hot, pulsing member, eliciting a pleased groan from the futanari mouse, which entices you to use your grip around it to lead her to the makeshift bed, where you sink down onto your back and spread your ");
            // Something is Fishy about this choice. I think it was a placeholder.
            if (player.isBiped()) outputText(player.legs() + " in readiness for her.");
            else outputText(" [cunt] in readiness for her.");

            outputText(" Amily kneels down in between them, easily able to tell what you want.<br><br>");

            //(If first time: CHECK ODD IF THEN IN TEXT
            if (gameFlags[AMILY_HERM_TIMES_FUCKED_BY_FEMPC] == 0) outputText("\"<i>Er... are you really sure about this? I mean...</i>\" Amily murmurs uncertainly, until, irritated, you suddenly wrap your " + player.legs() + " around her waist and pull her the last few inches needed to slam her dick into your needy pussy. She " + ((gameFlags[AMILY_NOT_FURRY] == 0) ? "squeaks" : "gasps") + " in shock and tries to pull out, but you still have your grip on her and pull her back, a process that repeats several times until the rhythm of it sinks in and Amily starts to thrust back and forth on her own.<br><br>");
            else outputText("Amily grips your " + player.hipDescript() + ", gathering her courage, and then plunges her penis into your depths. Cautiously at first, she begins to thrust herself back and forth, growing faster and harder as her resolve builds.");

            // UNCOMMENT WHEN cuntChange function is complete in Creature.js
            //player.cuntChange((gameFlags[AMILY_WANG_LENGTH] * gameFlags[AMILY_WANG_GIRTH]), true, true, false);
            //outputText("<br><br>");

            //CHECK ODD IF THEN IN TEXT
            outputText("Amily's ministrations are hardly the most expert of sexual techniques you've seen in Mareth, but her intentions to make it as pleasant as possible for you are obvious, and what she lacks in expertise she makes up for in enthusiasm, " + ((gameFlags[AMILY_NOT_FURRY] == 0) ? "squeaking" : "panting") + " and moaning as the unfamiliar sensations of your " + player.vaginaDescript() + " gripping her newfound penis fill her. You work your hardest to make it good as well, but Amily's inexperience with having a male sexual organ is evident in that she soon loses control and, with a loud " + ((gameFlags[AMILY_NOT_FURRY] == 0) ? "squeak" : "groan") + ", you feel her shooting cum into your thirsty " + player.vaginaDescript() + ". The hot fluid gushes from her futa-member, and when the last few drops have dripped from her, she collapses onto you, panting.<br><br>");

            //(First time:
            if (gameFlags[AMILY_HERM_TIMES_FUCKED_BY_FEMPC] == 0) outputText("\"<i>...I had no idea it would feel like that,</i>\" she gasps softly.<br><br>");
            else outputText("\"<i>It gets me every time when that happens. Is this what it's like for men?</i>\" she wonders.<br><br>");

            outputText("You smile and reach up to stroke her cheek. She smiles back and reaches down to pat you on your belly.");

            //(If player is preg
            /*
             if (player.isPregnant()) {
             if (player.pregnancyType == PregnancyStore.PREGNANCY_AMILY)
             outputText("\"<i>Boy, this is weird.  I'm a woman and I'm going to be a dad.");
             else outputText("\"<i>After you give birth to this baby come and see me when you're ready for mine.  This is really weird, I'm a woman and I can't wait to be a dad.");
             }
             //not preg yet!
             else {
             outputText("\"<i>Let's see if you'll be a mommy from this load... If not, well, I guess we'll have to try again.");
             //PREGGO CHECK HERE
             player.knockUp(PregnancyStore.PREGNANCY_AMILY, PregnancyStore.INCUBATION_MOUSE);
             }
             */
            outputText("</i>\"  Chuckling softly, you lay there and embrace your lover for a time and then, reluctantly, you get dressed and leave.");
            player.orgasm();
            gameFlags[AMILY_HERM_TIMES_FUCKED_BY_FEMPC]++;
            gameFlags[AMILY_FUCK_COUNTER]++;
            doNext(Camp.returnToCampUseOneHour);

        };


        /******
         * First time having sex with Amily
         *******/



//Having sex with Amily for the first time - NEED SPRITE, PLAYER VARS
        AmilyScene.amilySexFirstTime = function () {
            clearOutput();

            outputText("Amily leads you on a convulated route through the ruins of the village. Up streets, down streets, around corners, even straight through some ruins. ");
            //(If player is five feet or less in height:
            //if (player.tallness < 60) outputText("Fortunately, being smaller than average means you have less difficulty following her than you might.");
            // else if (player.tallness >= 84) outputText("Your considerable size makes it surprisingly tricky to get around, but you manage to stay with her.");
            outputText("  Finally, you are led into one particular ruined house, and from there, to a bedroom. It's not exactly an impressive sight; a few bits of smashed furniture, and a large mound of vaguely clean rags and tattered cushions is the closest thing to a bed. The floor is covered in a thick layer of dirt - more than just dust, it's like dirt was deliberately brought in from outside.<br><br>");
            outputText("Amily sees you examining the room and looks sheepish. \"<i>I have to stay hidden, I can't afford to make it too obvious that anyone lives here. That dirt actually helps warn me if anyone else has found this bolthole.</i>\" She idly takes her tail in one hand and starts stroking the tip. \"<i>So... here we are?</i>\" She says, hesitantly. It's clear that for all her insistence on this being what she needed to do, she's evidently a virgin, and has no real idea of how to proceed from here. What do you do?<br><br>");


            addButton(0, "Take Charge", AmilyScene.amilySexFirstTimeTakeCharge, null, null, null, "Let me show her how it's done...");
            addButton(1, "Hesitate", AmilyScene.amilySexFirstTimeHesitate, null, null, null, "Maybe she'll make the first move?");
            addButton(2, "Kiss Her", AmilyScene.amilySexFirstTimeKiss, null, null, null, "Romance is key. Maybe you shouldn't let her forget?");


        };


// "Take charge" (i.e be a total douche) during first sexual encounter with Amily - NEED SPRITE, COCK VARS
        AmilyScene.amilySexFirstTimeTakeCharge = function () {
            clearOutput();
            //outputText(images.showImage("amily-forest-takecharge"), false);

            outputText("You decide that the scenery doesn't matter; Amily promised you sex, and you want that sex. Without a word you step forward and give her a mighty push, sending her falling onto her butt with a squeak as you thrust her towards the \"<i>bed</i>\" - that she lands in it is more coincidence than anything. You drop down on top of her, pinning her arms and legs with your own.<br><br>");

            outputText("\"<i>Hey, what's the big idea?</i>\" She protests indignantly.<br><br>");

            outputText("\"<i>You wanted sex with me, so just shut up, lie back and take it.</i>\" You snap back at her.<br><br>");

            outputText("Amily goes quiet, her eyes hardening into gimlets. It's pretty obvious she's not happy about this in the slightest, but she doesn't protest as you roughly pull off her shirt and her pants, exposing her pink sex, and then begin to tear off your own clothes.<br><br>");

            //(If player has penis 14 inches or more long)
            if (player.cocks[0].cockLength >= 14) {
                // And said huge cock is human. CHECK INDEX NUMBER HERE AS WELL!
                if (player.cocks[0].cockType == CockTypesEnum.HUMAN) { // || player.cocks[0].cockType.Index > 3) {
                    outputText("Her eyes go wide with shock and fear as you reveal your impressively sized member, already growing erect and hard. \"<i>You can't stick that in me! It'll never fit!</i>\" She squeals.<br><br>");
                    outputText("\"<i>I'll make it fit!</i>\" You assure her.<br><br>");
                }
                // Or demon...
                else if (player.cocks[0].cockType == CockTypesEnum.DEMON) {
                    outputText("Horror and disgust write themselves on her features as your knobbly, diabolic penis is revealed to her. \"<i>What kind of monster are you?! You'll kill me with that unholy thing!</i>\"<br><br>");
                    outputText("\"<i>Just shut up and you'll enjoy this.</i>\" You promise her.<br><br>");
                }
                // Or equine...
                else if (player.cocks[0].cockType == CockTypesEnum.HORSE) {
                    outputText("Her eyes go wide with shock and fear as she discovers your stallion-like cock. \"<i>Even in this world, being hung like a horse isn't a good thing! I can't take something like that!</i>\"<br><br>");
                    outputText("\"<i>How do you know until you've tried?</i>\" You ask.<br><br>");
                }
                // or Canine/Knotted
                else if (player.hasKnot(0)) {
                    outputText("\"<i>You can't be serious!</i>\" She protests when she sees what you have hidden in your pants.<br><br>");
                    outputText("You don't bother to answer her, instead licking your lips as you imagine what she'll feel like wrapped around your cock.<br><br>");
                }
            }
            outputText("Without further ado, you thrust into her, eliciting a shriek of equal parts pain and rage. Ignoring that, you focus on trying to squeeze as much as your cock as you can into her warm, tight, velvety depths. She sobs and moans as you struggle, ");

            if (player.cocks[0].cockLength >= 14) outputText("failing to fit in more than a foot of your cock's length, ");

            outputText("but she doesn't try very hard to fight you off.<br><br>");

            outputText("Your hips thrust back and forth, harder and faster as you grow more and more aroused. Her cunt grips you like a vice, and you can feel the warm delicious pressure building up inside you. Stronger and stronger it grows, until you cannot hold it back any more and with a roar let your cum gush out, flooding her as deeply as you can.<br><br>");

            outputText("Only when you are sure that the last of your climax is over do you pull out, carelessly striding over to retrieve your clothing and start getting dressed. Amily stares at you, her eyes hard and sharp as flints. \"<i>Was it good for you?</i>\" She spits. \"<i>Let's hope we've both gotten what we want out of this.</i>\"<br><br>");

            outputText("\"<i>I'll be happy to come back and do it again if you need.</i>\" You jeer back, finishing dressing yourself and leaving her without so much as a backwards glance.<br><br>");
            player.orgasm();
            // Lower affection because you were an ass!
            gameFlags[AMILY_AFFECTION] -= 5;

            AmilyScene.amilyPreggoChance();
            doNext(Camp.returnToCampUseOneHour);
        };
// Wait for Amily to make the first move during first sexual encounter. - NEED SPRITE, PLAYER COCK VARS
        AmilyScene.amilySexFirstTimeHesitate = function () {
            clearOutput();
            //outputText(images.showImage("amily-forest-plainfuck"), false);

            outputText("Amily may be a cute little girl, but you're not sure it's really a good idea to... proceed... So you just wait for her to decide whether she really wants to have sex here and now. After a few moments, when it's clear that you're not going to do anything, she frowns a little and steps up to you. Looking up into your eyes, you suddenly realize she wants a kiss. Bending down your head, you plan to give her a rather chaste kiss, but Amily obviously has other ideas. You feel your tongue entering her mouth, and what was intended as a short, innocent kiss turns into a very hot, rather 'not-so-innocent' one.  Suddenly you feel her little hand (or paw?) grabbing your ass.<br><br>");

            outputText("Despite this passionate display, though, she doesn't seem to really be 'feeling' it, more going through the motions to arouse you. You are too horny to care that much.<br><br>");

            //(If player has a penis 14" long or more)
            if (player.cocks[0].cockLength >= 14) {
                outputText("She leads you to her 'bed' and makes you sit down before stripping in front of you and kneeling down to help you take off your clothes.  At the sight of your huge penis, she's obviously unsure of how to proceed. After a moment or two thinking about it, she begins to stroke it with her hand. Once she has you hard and almost ready to explode on her, she sits back directly in front of you, guides the tip of your member into her netherlips and resumes stroking. She adds her other hand and her tail and continues to give you a combined hand- and tail-job until you orgasm. While it doesn't feel bad, you get the feeling that it could have been much better - and you also realize that Amily seems to be... disappointed.<br><br>");
            } else outputText("At the sight of your member, she grins and begins stroking it. \"<i>You are obviously the right size for me...</i>\" Before long, you're hard and almost desperately waiting for her to start doing 'it' for real. Never losing her grin, she slowly lowers herself onto you and guides your penis into her netherlips. The feeling is better than you imagined, but still, something doesn't feel quite right... However, as soon as the mouse-girl starts moving up and down, you forget anything but the pleasure you feel. It doesn't take long before you can't hold back anymore. Afterwards, Amily looks into your eyes for a moment before standing up and putting on her clothes again. You get the distinct feeling that she's somehow disappointed.<br><br>");

            outputText("Seeing as how she clearly has no further need for you, you quietly excuse yourself, get dressed and leave.");
            // Lower affection slightly because you were timid
            gameFlags[AMILY_AFFECTION] -= 2;

            AmilyScene.amilyPreggoChance();
            player.orgasm();
            doNext(Camp.returnToCampUseOneHour);

        };

// Kiss Amily first before going further during first sexual encounter -- NEED SPRITE
        AmilyScene.amilySexFirstTimeKiss = function () {
            clearOutput();

            //outputText(images.showImage("amily-forest-kissingfuck"), false);
            outputText("While the scenery certainly isn't anything you'd call \"<i>romantic</i>\" or \"<i>arousing</i>\", the eager little mouse-girl in front of you is quite appealing, so you step up to her, take her in your arms and lightly kiss her. Seeing her eyes widen in surprise for a moment, she soon closes her eyes and returns the kiss. Continuing the kiss you two begin to explore each other. Along the way, you help each other out of your clothes and slowly, almost reluctantly step back so you can for the first time see each other without anything in the way.<br><br>");

            //(If player has a penis 14" long or more)
            if (player.cocks[0].cockLength >= 14) outputText("At the size of your penis, Amily's eyes widen, but she still seems to be almost mesmerized. Slowly, blushing furiously and avoiding your gaze, she touches it and begins stroking your member. It soon turns into a veritable hand-job. Not taking her hand away, the mouse-girl guides you to the 'bed' and asks you to lie down. She continues stroking your penis with her hand, but also uses her tail and her tongue to bring you closer and closer to orgasm. Just before you can't hold back anymore, she sits down on your legs and slowly guides the tip of your penis to her netherlips. Soon, this 'almost penetration' overwhelms you and sends you over the edge.<br><br>");

            else {
                outputText("She looks down between your legs and, blushing, smiles. \"<i>It's nice to see a " + player.mf("man", "woman") + " who hasn't gone insane about that part.</i>\" She murmurs to you, holding you as tightly as she can. Despite the fact you can feel her hands pressed against your back, you suddenly become aware of something stroking your penis as well; it takes a bit of wriggling, which presses her small, perky breasts to your chest in the most interesting way, but you can see that she is using her tail. Working in synch as best you can, the two of you crabwalk over to the pile of bedding and topple over; you land on your back, and she lands on you.<br><br>");

                outputText("By this point, your member is rock hard, and Amily pushes, somewhat reluctantly, against your grip, positioning herself so that the two of you are crotch to crotch. Looking up at her, you start to mouth the question \"<i>Are you okay with this?</i>\" to her, but she smiles, nods her head insistently, and then her lips seal themselves against yours again. Her vagina hovers almost teasingly against the tip of your cock as she works up the courage to make the final plunge... and plunge she does, suddenly skewering herself to the hilt upon you, to your shock. You can feel her pained wince, muscles clenching in pain all up her body, and you hold her tighter, kiss her deeper, in an effort to try and comfort her. You lie there, holding her, until she relaxes and unclenches, slowly beginning to work herself back and forth.<br><br>");
            }

            outputText("Enjoying the sensations, you start caressing her to increase her pleasure, too. It doesn't take long for you both to orgasm, before Amily sinks down on you, looking into your eyes with a smile on her face.<br><br>");

            outputText("\"<i>...That was... wow. Uh, I mean.</i>\" She hastily corrects herself, blushing. \"<i>I guess you weren't so bad... I knew I had a good feeling about you.</i>\" She smiles. \"<i>You do know I'm not neccessarily pregnant, right? We're going to have to do this again.</i>\"<br><br>");

            outputText("You smile, and tell her that you're happy to do it with her as often as it takes. She blushes so red ");
            if (gameFlags[AMILY_NOT_FURRY] == 0) outputText("it's almost like the fur on her cheeks has turned red.");
            else outputText("she nearly resembles an imp!");

            outputText("  Excusing yourself, you get dressed, receiving a lazy wave goodbye and a happy smile as you head out of the door and head for the main street, from there finding the way back to your camp.<br><br>");

            // Amily liked her first time!
            gameFlags[AMILY_AFFECTION] += 3;
            player.orgasm();

            AmilyScene.amilyPreggoChance();
            doNext(Camp.returnToCampUseOneHour);

        };

        /**********
         *
         * Amily Pregnancy Checks
         *
         ***********/

// Pregnancy array for Amily
        AmilyScene.amilyPregnancy = new PregnancyStore.Pregnancy(gameFlags[AMILY_PREGNANCY_TYPE], gameFlags[AMILY_INCUBATION], gameFlags[AMILY_BUTT_PREGNANCY_TYPE], gameFlags[AMILY_OVIPOSITED_COUNTDOWN]);


// DONE, surprisingly. But there are other pregnancy functions that are needed.
        AmilyScene.amilyPreggoChance = function () {
            //Is amily a chaste follower?
            if (gameFlags[AMILY_FOLLOWER] == 1) {
                //If pregnancy not enabled, GTFO
                if (gameFlags[AMILY_ALLOWS_FERTILITY] == 0) return;
            }
            //Cant repreg if already preg!
            if (AmilyScene.amilyPregnancy.isPregnant() == true) {
                //outputText("DEBUGGER: Already Pregnant")
                return;
            }

            // Cant preg if at the farm
            if (gameFlags[FOLLOWER_AT_FARM_AMILY] != 0) return;

            //25% + gradually increasing cumQ bonus
            //if (rand(4) == 0 || player.cumQ() > rand(1000)) {
            AmilyScene.amilyPregnancy.eventFill([150, 120, 100, 96, 90, 72, 48]);
            AmilyScene.amilyPregnancy.knockUpForce(PREGNANCY_PLAYER, INCUBATION_MOUSE - 182);
            timeAware.push(AmilyScene.amilyPregnancy);

            //}
            //      outputText("Amily got pregnant!");


        };


        /*************
         *
         * CORRUPTION PATH
         *
         **************/

//Requires PC have done first meeting and be corrupt - NEED PREGNANCY EVENTS
        AmilyScene.meetAmilyAsACorruptAsshat = function () {
            clearOutput();
            outputText("Curious about how Amily is holding up, you head back into the ruined village. This time, you don't bother making any secret of your presence, hoping to attract Amily's attention quicker. After all, she did say that the place is basically empty of anyone except her, and you can handle a measly Imp or Goblin.<br><br>");
            switch (AmilyScene.amilyPregnancy.pregnancyEventCounter) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 5: //Amily is slightly pregnant
                    outputText("Amily materializes out of the ruins, somewhat slower than usual. You can see that your efforts together have taken; an undeniable bulge pokes out of her midriff, pushing up her tattered shirt slightly and seriously straining her belt. She idly strokes it with one hand, as if confirming its presence to herself.<br><br>");
                    break;
                case 6:
                //Amily is heavily pregnant
                case 7:
                    outputText("It takes several minutes before Amily appears - but when you can see her, you marvel that she got to you as quickly as she did. Her stomach is hugely swollen, and one of her hands actually cradles underneath its rounded expanse as if trying to hold it up. She is pantsless, evidently no longer able to fit into them with this firm orb of a belly, and her shirt drapes loosely, barely managing to cover its upper half. Her belt, where she hangs her blowpipe and dagger, has been tied around her upper chest, between her breasts and her bulge, so she can still carry them effectively.<br><br>");
                    break;
                default: //Amily is not pregnant
                    outputText("It doesn't take long for Amily to materialize out of the ruins. Her blowpipe and dagger are both thrust into her belt, and she's still wearing the same tattered clothes as before<br><br>");
            }


            outputText("\"<i>Hey there, " + player.short + ", how... are you?</i>\" She trails off with a troubled expression. \"<i>You seem different...</i>\" She murmurs, studying you intently, and then she obviously comes to a sudden realization. \"<i>Have you had contact with demons!? You... This feeling... You're corrupted!</i>\" You take a step towards her, causing her to leap back. \"<i>N-No! Stay away!</i>\" She yells, hand darting towards her blowpipe. She spits a dart right at you!<br><br>");

            /*
             //(if PC doesn't have the perk Evasion or Feline Flexibility)
             if (player.findPerk(PerkLib.Evade) < 0 && player.findPerk(PerkLib.Flexibility) < 0) {
             outputText("Amily's sudden reaction catches you off guard and the dart hits you; almost immediately you feel your body going stiff. Amily doesn't even wait to see if she hit you or not before running away, yelling back at you.\n\n", false);

             outputText("\"<i>Don't come near me again!  You're tainted, ruined!</i>\" Her voice is panicked, as she disappears into the ruins.\n\n", false);

             outputText("It takes almost two hours before you are able to move again, and your joints are still stiff and painful as you hobble back to camp, cursing that mouse. Maybe you should teach her not to mess with you.\n\n", false);

             //-(if PC's int >= 40)
             if (player.inte >= 40) outputText("You begin to formulate a plan, but to put this plan into motion you'll require a Lust Draft and some Goblin Ale. That damn rat is going to rue the day she denied you.\n\n", false);
             //-(else)
             else outputText("You think about some of the more interesting potions you found while exploring; perhaps you could use some of them...", false);
             }
             //(else)
             else { */
            outputText("Despite Amily's fast reactions, they're no match for your trained reflexes; you bend just enough for the dart to barely graze you. Amily doesn't even wait to see if she hit you or not before running away, yelling back at you.<br><br>");

            outputText("\"<i>Don't come near me again!  You're tainted, ruined!</i>\" Her voice is panicked, as she disappears into the ruins.<br><br>");

            outputText("That stupid cunt; how dare she attack you after asking you to help her! So what if you are aren't so pure anymore; you're still very much capable of helping her! Maybe you should teach her not to mess with you...?<br><br>");

            //-(if PC's int >= 40)
            if (player.inte >= 40) outputText("You begin to formulate a plan, but to put this plan into motion you'll require a Lust Draft and some Goblin Ale. That damn rat is going to rue the day she denied you.<br><br>");
            //-(else)
            else outputText("You think about some of the more interesting potions you found while exploring; perhaps you could use some of them...");
            //}
            player.changeLust(25);
            gameFlags[AMILY_CORRUPT_FLIPOUT] = 1;
            doNext(Camp.returnToCampUseOneHour);
            //FLAG THAT THIS SHIT WENT DOWN
        };

// COOKING THE POTENT MIXTURE - IN PROGRESS
        AmilyScene.cookAmilyASnack = function () {
            clearOutput();
            //[Cooking the drug - repeat]
            if (gameFlags[AMILY_DRANK_POTENT_MIXTURE] > 0) {
                //After raping Amily for the first time, she is commited to the path of corruption.
                //Used to get to stage 2 and 3 of corruption, for stage 4 PC only needs the correct amount of Corruption.
                //Potent Mixture key-item added to inventory.
                //Takes 1 hour.
                //(if PC doesn't have the required items)
                if (!(player.hasItem(Items.Consumables.LustDraft) || player.hasItem(Items.Consumables.FuckDraft)) || !player.hasItem(Items.Consumables.GoblinAle)) {
                    outputText("You think about going into the Ruined Village, but you don't have the ingredients to create more of Amily's medicine. You return to your camp.");
                    doNext(Camp.returnToCampUseOneHour);
                    return;
                }
                //(if PC is genderless and has the ingredients.)
                else if (player.gender == 0) {
                    outputText("You think about going into the Ruined Village, but without a cock or a pussy you can't complete the mixture. You return to your camp.");
                    doNext(Camp.returnToCampUseOneHour);
                    return;
                }
                //(else)
                else {
                    outputText("You pick up a bowl and carefully pour the contents of the Lust Draft and Goblin Ale inside, then you produce a wooden branch and begin stirring the contents until they are mixed together. Then you dip a finger and have a taste; ");
                    if (player.hasCock()) {
                        outputText(player.sMultiCockDesc() + " jumps to attention ");
                        if (player.hasVagina()) outputText("and ");
                    }
                    if (player.hasVagina()) outputText("your " + player.vaginaDescript() + " moistens itself ");
                    outputText("in preparation for the next step.<br><br>");

                    //Herms will do male variant with something extra, then play the female variant.
                    //[Male]
                    if (player.hasCock()) {
                        outputText("You begin to stroke your " + player.cockDescript(0) + " vigorously, milking drop after drop of pre. With each stroke you think of how fun it'll be to fuck that rodent. You imagine her becoming a slut who lives only to breed and fuck; begging you to fuck her again and again, belly swollen with your offspring, swarms of her half-grown daughters clustering around and just as eager to fuck as their worthless whore of a mother... The thoughts spur you on, and soon send you over the edge; jet after jet of hot jism splatters the ground around you, painting it white. Remembering what you were going to do, you struggle to hold back one last jet; you keep holding back for far longer than you thought yourself capable, building this last jet especially for Amily's delight; the orgasmic sensations of pleasure continue rippling through you, but somehow you manage to kneel and aim yourself at the bowl. Finally you let go and dump a huge load of white hot spunk into the bowl, splattering some of its contents onto the ground.");
                        //[(If PC is a herm.)
                        if (player.hasVagina()) outputText("  Not yet fully sated, you decide that it couldn't hurt to add something 'girly' to the mixture...");
                        outputText("<br><br>");
                    }
                    //[Female]
                    if (player.hasVagina()) {
                        outputText("You begin to stroke your " + player.vaginaDescript(0) + " vigorously, pinching your clit and dripping all over the floor. Every time a new gush of fluids escapes your " + player.vaginaDescript() + ", you think of how much fun you'll have with Amily. You'll have her lick you again and again until you pass out; perhaps you can even get her to grow a dick so the two of you can have more fun; after all, she's always going on and on about how she wants babies, well, she doesn't have to be the one carrying them does she? You imagine how it'd be to get knocked up by Amily; your belly growing big with tiny mice as Amily's reduced to a pile of fuck and breed; incapable of doing anything but begging you for a good fucking. Just imagining this is enough to push you over the edge and your juices shower on the ground below you. It feels so good that you almost forget why you began masturbating in the first place. You squat above the bowl and begin pinching and massaging your clit, trying to draw one last burst of girlcum just for Amily; you hold back, intent on making this final orgasm extra pleasurable and extra-long. Finally you feel it hit you; you look down just in time to see your fluids splatter into the bowl; the heavy musk of sex fills the air around you, prolonging your orgasm and causing the bowl to overflow. You moan as the last of your fluids hit the bowl and overflow it.<br><br>");
                    }
                    outputText("After taking a few minutes to rest you look inside the bowl; the mixture has become pinkish-white in color and it bubbles omniously. You take one of the empty bottles and fill it with as much of the mixture as you can, before putting the cork back and putting it back into your pouch. Now all you have to do is find Amily... You smile wickedly as you head back to camp.");

                    //CONSUME THE ITEMS AND PUT THE POTENT MIXTURE ITEM INTO KEY ITEM INVENTORY. MAY NEED TO RENAME THAT FLAG.

                    //Consume items
                    //if (player.hasItem(consumables.L_DRAFT)) player.consumeItem(consumables.L_DRAFT);
                    //else player.consumeItem(consumables.F_DRAFT);
                    //player.consumeItem(consumables.GOB_ALE);
                    //player.createKeyItem("Potent Mixture",0,0,0,0);
                    gameFlags[AMILY_DRANK_POTENT_MIXTURE]++;
                }
            }
            //First Time Cooking the Drug
            else {
                //(if PC doesn't have the required items and has >= 25 Corruption)
                if (!(player.hasItem(Items.Consumables.LustDraft) || player.hasItem(Items.Consumables.FuckDraft)) || !player.hasItem(Items.Consumables.GoblinAle)) {
                    outputText("You think about going into the Ruined Village, but decide it's best to wait until you have a plan underway. Maybe some lust draft and a goblin ale to get the ball rolling... You return to your camp.");
                    doNext(Camp.returnToCampUseOneHour);
                    return;
                }
                //(else if the PC is genderless)
                else if (player.gender == 0) {
                    outputText("You think about going into the Ruined Village, but decide to turn back; right now, you just don't have the proper 'parts' to get the job done, and so you return to your camp.<br><br>");
                    doNext(Camp.returnToCampUseOneHour);
                    return;
                }
                //(else)
                else {
                    outputText("You pick up a bowl and carefully pour the contents of the ");
                    if (player.hasItem(Items.Consumables.LustDraft)) outputText("Lust Draft ");
                    else outputText("Fuck Draft ");
                    outputText("and Goblin Ale inside, then you produce a wooden branch and begin stirring the contents until they are mixed together. Slowly you dip a finger and take a experimental lick; you're almost knocked back by the strong taste, your ");
                    if (player.hasCock()) outputText(player.cockDescript(0) + " jumps up to attention");
                    if (player.hasCock() && player.hasVagina()) outputText(", and your ");
                    if (player.hasVagina()) outputText(player.vaginaDescript() + " nearly juices itself");
                    outputText(".  You smile wickedly; no doubt this mixture is going to make that stupid cunt open her legs and beg for a good fucking; but you feel there's still something missing...<br><br>");

                    outputText("As you think about what could be missing your hand idly moves lower to stroke your ");
                    if (player.hasCock()) outputText(player.cockDescript(0));
                    if (player.hasCock() && player.hasVagina()) outputText(" and ");
                    if (player.hasVagina()) outputText(player.vaginaDescript());
                    outputText("; then realization hits you. Of course! How could you forget to add some 'special sauce' to the mixture....?<br><br>");

                    //Herms will do male variant with something extra, then play the female variant.
                    //[Male]
                    if (player.hasCock()) {
                        outputText("You begin to stroke your " + player.cockDescript(0) + " vigorously, milking drop after drop of pre. With each stroke you think of how fun it'll be to fuck that rodent. You imagine her becoming a slut who lives only to breed and fuck; begging you to fuck her again and again, belly swollen with your offspring, swarms of her half-grown daughters clustering around and just as eager to fuck as their worthless whore of a mother... The thoughts spur you on, and soon send you over the edge; jet after jet of hot jism splatters the ground around you, painting it white. Remembering what you were going to do, you struggle to hold back one last jet; you keep holding back for far longer than you thought yourself capable, building this last jet especially for Amily's delight; the orgasmic sensations of pleasure continue rippling through you, but somehow you manage to kneel and aim yourself at the bowl. Finally you let go and dump a huge load of white hot spunk into the bowl, splattering some of its contents onto the ground.");
                        //[(If PC is a herm.)
                        if (player.hasVagina()) outputText("  Not yet fully sated, you decide that it couldn't hurt to add something 'girly' to the mixture...");
                        outputText("<br><br>");
                    }
                    //[Female]
                    if (player.hasVagina()) {
                        outputText("You begin to stroke your " + player.vaginaDescript() + " vigorously, pinching your clit and dripping all over the floor. Every time a new gush of fluids escapes your " + player.vaginaDescript() + ", you think of how much fun you'll have with Amily. You'll have her lick you again and again until you pass out; perhaps you can even get her to grow a dick so the two of you can have more fun; after all, she's always going on and on about how she wants babies, well, she doesn't have to be the one carrying them does she? You imagine how it'd be to get knocked up by Amily; your belly growing big with tiny mice as Amily's reduced to a pile of fuck and breed; incapable of doing anything but begging you for a good fucking. Just imagining this is enough to push you over the edge and your juices shower on the ground below you. It feels so good that you almost forget why you began masturbating in the first place. You squat above the bowl and begin pinching and massaging your clit, trying to draw one last burst of girlcum just for Amily; you hold back, intent on making this final orgasm extra pleasurable and extra-long. Finally you feel it hit you; you look down just in time to see your fluids splatter into the bowl; the heavy musk of sex fills the air around you, prolonging your orgasm and causing the bowl to overflow. You moan as the last of your fluids hit the bowl and overflow it.<br><br>");
                    }
                    outputText("After taking a few minutes to rest you look inside the bowl; the mixture has become pinkish-white in color and it bubbles omniously. You take one of the empty bottles and fill it with as much of the mixture as you can, before putting the cork back and putting it back into your pouch. Now all you have to do is find Amily... You smile wickedly as you head back to camp.<br><br>");
                    //Consume items
                    /*
                     if (player.hasItem(consumables.L_DRAFT)) player.consumeItem(consumables.L_DRAFT);
                     else player.consumeItem(consumables.F_DRAFT);
                     player.consumeItem(consumables.GOB_ALE);
                     player.createKeyItem("Potent Mixture",0,0,0,0);
                     */
                    gameFlags[AMILY_DRANK_POTENT_MIXTURE]++;
                }
            }
            player.orgasm();
            doNext(Camp.returnToCampUseOneHour);
        };




/* Holding comment for stuff from the original CoC code

 public function AmilyScene()
 {


 CoC.timeAwareClassAdd(this);
 }

 //Implementation of TimeAwareInterface
 public function timeChange():Boolean
 {
 var needNext:Boolean = false;
 pregnancy.pregnancyAdvance();
 trace("\nAmily time change: Time is " + model.time.hours + ", type: " + pregnancy.type + ", incubation: " + pregnancy.incubation + ", event: " + pregnancy.event);
 trace("\nAmily time change: butt type: " + pregnancy.buttType + ", butt incubation: " + pregnancy.buttIncubation + ", butt event: " + pregnancy.buttEvent);
 if (flags[kFLAGS.AMILY_BLOCK_COUNTDOWN_BECAUSE_CORRUPTED_JOJO] > 0) flags[kFLAGS.AMILY_BLOCK_COUNTDOWN_BECAUSE_CORRUPTED_JOJO]--;
 if (flags[kFLAGS.AMILY_INCEST_COUNTDOWN_TIMER] > 0 && flags[kFLAGS.AMILY_INCEST_COUNTDOWN_TIMER] < 30 * 24) flags[kFLAGS.AMILY_INCEST_COUNTDOWN_TIMER]++;
 if (flags[kFLAGS.AMILY_FOLLOWER] == 1) {
 if (pregnancy.isPregnant && pregnancy.incubation == 0) {
 outputText("\n");
 amilyPopsOutKidsInCamp();
 pregnancy.knockUpForce(); //Clear Pregnancy
 outputText("\n");
 needNext = true;
 }
 if (pregnancy.isButtPregnant && pregnancy.buttIncubation == 0) {
 amilyLaysEggsLikeABitch();
 pregnancy.buttKnockUpForce(); //Clear Pregnancy
 needNext = true;
 }
 }
 if (model.time.hours == 6) {
 //Pure amily flips her shit and moves out!
 if (flags[kFLAGS.AMILY_FOLLOWER] == 1 && player.cor >= 66 + player.corruptionTolerance() && flags[kFLAGS.UNKNOWN_FLAG_NUMBER_00173] > 0) {
 amilyScene.farewellNote();
 needNext = true;
 }
 //Amily moves back in once uncorrupt.
 if (flags[kFLAGS.AMILY_TREE_FLIPOUT] == 0 && flags[kFLAGS.UNKNOWN_FLAG_NUMBER_00173] > 0 && player.cor <= 25 + player.corruptionTolerance() && flags[kFLAGS.AMILY_FOLLOWER] == 0) {
 amilyScene.amilyReturns();
 needNext = true;
 }
 }
 else if (model.time.hours > 23) {
 if (flags[kFLAGS.AMILY_X_JOJO_COOLDOWN] > 0) flags[kFLAGS.AMILY_X_JOJO_COOLDOWN]--;
 }
 return needNext;
 }

 public function timeChangeLarge():Boolean {
 if (!kGAMECLASS.urtaQuest.urtaBusy() && flags[kFLAGS.AMILY_VISITING_URTA] == 2 && model.time.hours == 6) {
 kGAMECLASS.followerInteractions.amilyUrtaMorningAfter();
 return true;
 }
 if (flags[kFLAGS.AMILY_FOLLOWER] == 1 && model.time.hours == 6 && flags[kFLAGS.CAMP_WALL_PROGRESS] >= 100 && flags[kFLAGS.CAMP_WALL_SKULLS] < 100 && rand(3) == 0) {
 flags[kFLAGS.CAMP_WALL_SKULLS]++;
 }
 return false;
 }
 //End of Interface Implementation






 //Preggo birthing!


 if (amilyCanHaveTFNow())
 {
 amilyDefurrify();
 return;
 }
 //meeting scenes for when PC is the same gender as when they last met Amily
 if (flags[kFLAGS.AMILY_PC_GENDER] == player.gender) {
 //"bad" or "good" ends.
 if (flags[kFLAGS.AMILY_BIRTH_TOTAL] + flags[kFLAGS.PC_TIMES_BIRTHED_AMILYKIDS] >= 5 && flags[kFLAGS.AMILY_VILLAGE_ENCOUNTERS_DISABLED] == 0)
 {
 if (flags[kFLAGS.AMILY_AFFECTION] < 40) thisIsAReallyShittyBadEnd();
 else thisFunctionProbablySucksTooOhYeahAmilyFunction();

 return;
 }







 // Surprise remeeting would go into amily.Start, but it's commented out. Will talk with other coders about it.

 //[Surprise Remeeting]
 /*(random chance of happening instead of [Normal Remeeting] if player meets 'requirements' for stalking Amily)
 if (player.spe > 50 && player.inte > 40 && rand(4) == 0) {
 outputText("Deciding to find Amily first instead of waiting for her to find you, you set off into the ruins. Using all of your knowledge, skill and cunning to figure out where she is likely to be, you make your way there without giving yourself away.<br><br>");
 //[Amily is not pregnant]
 if (flags[kFLAGS.AMILY_INCUBATION] == 0) {
 outputText("Finally, you find her squatting down in front of a small bush. She's industriously picking it clean of berries, gulping down almost as many as she puts into a small sack at her side.<br><br>");
 }
 //[Amily is slightly pregnant]
 else if (flags[kFLAGS.AMILY_INCUBATION] >= 90) {
 outputText("Finally, you find her rummaging through the contents of a home that has been torn open. She appears to be looking for as many old strips of cloth as she can find.<br><br>");
 }
 //[Amily is heavily pregnant]
 else {
 outputText("Finally, you find her emerging from a turn-off, pulling up her pants and muttering to herself about her bladder.<br><br>");
 }
 outputText("How do you approach her?");
 //Announce yourself / Scare her
 simpleChoices("Announce",sneakyUberAmilyRemeetingsAnnounce,"Scare Her",scareAmilyRemeetingsProBaws,"",0,"",0,"",0);
 return;
 }*/
/*







 /*FAILSAFE - ALL GENDERS HAVE HAD THERE GO AN NOTHING HAPPENED!
 outputText("You enter the ruined village cautiously. There are burnt-down houses, smashed-in doorways, ripped-off roofs... everything is covered with dust and grime. You explore for an hour, but you cannot find any sign of another living being, or anything of value. The occasional footprint from an imp or a goblin turns up in the dirt, but you don't see any of the creatures themselves. It looks like time and passing demons have stripped the place bare since it was originally abandoned. Finally, you give up and leave. You feel much easier when you're outside of the village – you had the strangest sensation of being watched while you were in there.");
 doNext(13);
 return;*/
/*
 }
 */
