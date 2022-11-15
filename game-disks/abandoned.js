const abandoned = () => ({
    roomId: 'intro', // Set this to the ID of the room you want the player to start in.
    rooms: [
        {
            id: 'intro', // Unique identifier for this room. Entering a room will set the disk's roomId to this.
            name: '==================================================================================================\n\n', // Displayed each time the player enters the room.
            img: `==================================================================================================
              _       __                             __                              __  
             / \\     [  |                           |  ]                            |  ] 
            / _ \\     | |.--.   ,--.   _ .--.   .--.| |  .--.   _ .--.  .---.   .--.| |  
           / ___ \\    | '/'\`\\ \\\`'_\\ : [ \`.-. |/ /'\`\\' |/ .'\`\\ \\[ \`.-. |/ /__\\\\/ /'\`\\' |  
         _/ /   \\ \\_  |  \\__/ |// | |, | | | || \\__/  || \\__. | | | | || \\__.,| \\__/  |  
        |____| |____|[__;.__.' \\'-;__/[___||__]'.__.;__]'.__.' [___||__]'.__.' '.__.;__] 
            `,
            desc: `You awaken...\n\n` +
                  `The room is dark, the only light seems to come from a barred window above beyond your reach.\n\n` +
                  `In your hands you feel a round metallic object, it feels like it's digging into your palm.\n\n` +
                  `Inspecting your hand reveals that a compass imbued with some kind of magic now occupies the space in your palm.\n\n` +
                  `As your eyes adjust to the darkness, you notice a cell door to your NORTH with a padlock.\n\n` +
                  `It's hard to see what's past the door due to the darkness, but you can make out the shape of a key just out of reach.\n\n` +
                  `[ COMMANDS : ITEMS | GO | LOOK AT | USE | HELP ]\n`,
            items: [
                {
                    name: 'door',
                    desc: 'It\'s rather unremarkable, an iron cell door barred to keep any human-sized being in... or out.', // Displayed when the player looks at the item.
                    onUse: () => println(`Type \'GO NORTH\' to try the door.`), // Called when the player uses the item.
                },
                {
                    name: ['padlock', 'lock'], // The player can refer to this item by either name. The game will use the first name.
                    desc: `It\'s a padlock. You put a key in and it locks or unlocks. It's black and in the shape of a padlock.`,
                },
                {
                    name: 'rope',
                    desc: `What a line of rope is doing in a prison cell is... well let's just say whoever was here wasn't so inquisitive as you.`,
                    isTakeable: true, // Allows the player to take the item.
                    onUse() {
                        const rope = getItemInInventory('rope');
                        if(rope.isHidden === true){
                            println(rope.desc);
                        } else{
                            getItem('key').isTakeable = true;
                            println(`You use the rope to fashion a lasso that you use to throw and reach the key.\nUnfortunately, as the you drag the rope back, it snags onto a sharpened stone and snaps.\n`);
                            rope.isHidden = true;
                            rope.desc = `It snapped and is now useless.`;
                        }
                    },
                },
                {
                    name: 'key',
                    desc: `A key for a padlock. Do I have to spell it out?`,
                    isTakeable: false, // Allows the player to take the item.
                    onTake(){
                        if(getItem('key').isTakeable === true){
                            println(`You take the key.`);
                        } else{
                            println(`It's too far away to take.`);
                        }
                    },
                    onUse() {
                        // Remove the block on the room's only exit.
                        const key = getItem('key');
                        const room = getRoom('intro');
                        const exit = getExit('north', room.exits);

                        if(key.isTakeable !== false){
                            if (exit.block) {
                                delete exit.block;
                                println(`You unlock the padlock on the NORTH door; you can now open it.`);
                                getItem('key').desc = `You've already used this key on the cell door padlock.`;
                                getItem('key').isHidden = true;
                            } else {
                                println(`There's nothing to use the key on.`);
                            }
                        } else{
                            println(`It's too far away to use.`);
                        }
                    },
                },
                {
                    name: 'skip',
                    desc: 'Debug tool, you\'re not supposed to see this if you\'re not a developer.',
                    isHidden: true,
                    onUse() {
                        const room = getRoom('intro');
                        const exit = getExit('north', room.exits);
                        const key = getItem('key');
                        const rope = getItem('rope');
                        if (exit.block) {
                            delete exit.block;
                            key.isHidden = true;
                            key.isTakeable = false;
                            rope.isHidden = true;
                            rope.isTakeable = false;
                            println(`SKIP ACTIVATED | You unlock the padlock on the NORTH door; you can now open it.`);
                        }
                    }
                }
            ],
            exits: [
                {
                    dir: 'north', // "dir" can be anything. If it's north, the player will type "go north" to get to the room called "A Forest Clearing".
                    id: 'intro_chamber',
                    block: `The door is locked.`, // If an exit has a block, the player will not be able to go that direction until the block is removed.
                },
            ],
        },
        {
            id: 'intro_chamber',
            img: '==================================================================================================\n',
            name: 'Underground Chamber\n' +
                  '==================================================================================================\n',
            desc: `You exit the cell.\n\n` +
                  `The room is made of stone bricks, poorly maintained covered in moss and mould alike.\n` +
                  `Nothing about this place strikes you as important, so you figure you weren't either.\n` +
                  `Though, it's hard to tell, you can't seem to recall who you are or how you ended up here.\n\n` +
                  `To your NORTH is a table with a spread of items.\n` +
                  `A guard sleeping on a chair alerts you. He seems to be "guarding" the room to your WEST.\n` +
                  `There's a staircase to your EAST, you're not sure where it leads as it curves upwards.\n` +
                  `To your SOUTH is the prison cell you just left.\n`,
            items: [
                {
                    name: ['glowing stone', 'stone'],
                    desc: 'On first glance it looks like a stone with some strange markings etched into it.\n' +
                          'As you approach for a better look, it emanates a strange and incomprehensible power.\n' +
                          'You\'re not sure why, but you feel that this stone may be calling to you.\n',
                    isTakeable: true,
                    onTake(){
                        println(`Whilst taking the stone, you hear footsteps coming down from the staircase.`);
                        println(`All of a sudden, the stone beckons you to use it.`);
                        getItem('glowing stone').desc = 'It beckons you to use it.';
                    },
                    onUse(){
                        if(getItem('glowing stone').isHidden === true){
                            println('It vanished from your palm, you can\'t use it anymore.');
                        } else{
                            println(`==================================================================================================\n`);
                            println(`Without hesitation, you subconsciously imbue the stone with some power.`);
                            println(`The stone starts to glow the same bluish-green hue as your compass.`);
                            println(`As the footsteps from the stairs grow closer, you anticipate the upcoming conflict.`);
                            println(`*step* *step* *step* *stomp*\n`);
                            println(`"Hey, Gerrick, you slackin' on the job again you lazy lout?"`);
                            println(`The guard sleeping next to the WEST door stands to attention and fumbles.`);
                            println(`"Haha you fucking numpty it's me, now hurry up, Captain's calling for us; I wouldn't want to keep him waiting."`);
                            println(`*The pitter-pattering of the guards' footsteps going up the stairs fills the silence.*\n`);
                            println(`Whilst you sit there in silence contemplating what just happened, the stone in your hand burns up.`);
                            println(`Searing your palm, you can't seem to let go of it as it burns your hand up.`);
                            println(`As the heat and pain subside, you notice the stone has vanished from your palm, leaving behind an inscription.`);
                            println(`The WEST room guard is gone now.`);
                            delete getExit('west', getRoom('intro_chamber').exits).block;
                            getItem('glowing stone').desc = 'It vanished from your palm, you can\'t use it anymore.';
                            getItem('glowing stone').isHidden = true;
                        }
                    },
                },
            ],
            exits: [
                {
                    dir: 'south',
                    id: 'intro',
                },
                {
                    dir: 'west',
                    id: 'intro_armoury',
                    block: 'A guard is sat on a chair next to the armoury door. You won\'t risk waking him up.',
                },
                {
                    dir: 'east',
                    id: 'intro_lobby',
                    block: 'You hear voices from the room upstairs. Maybe you should prepare yourself before going up.',
                },
            ],
        },
        {
            id: 'intro_armoury',
            img: '==================================================================================================\n',
            name: 'Chamber Armoury\n' +
                  '==================================================================================================\n',
            desc: 'Looking around, you notice that most of the weapons and armour present in the armoury are poorly maintained.\n' +
                  'The only usable piece of equipment seems to be a uniform resembling those worn by the guards you saw earlier.\n' +
                  'Maybe this could be a good way to blend in and get out of here.\n' +
                  'To your EAST is the underground chamber.\n',
            items:[
                {
                    name: ['rusted sword','sword'],
                    desc: 'It looks unusable, the handle\'s leather is rotten and the blade itself feels brittle.\n' +
                          'It\'s beyond use, but maybe you can keep it in its sheathe to look more convincing.',
                    isTakeable: true,
                    onTake(){
                        println('You daintily lift it from the table and put it in a sheathe.');
                        println('Being covered makes it look convincing enough to pass as a proper sword.');
                        getItem('rusted sword').desc = 'It\'s incredibly brittle and could break at any moment. Try not to move it around too much.';
                    },
                    onUse(){
                        println('Best not.');
                    },
                },
                {
                    name: ['tattered uniform', 'uniform'],
                    desc: 'It\'s a bit beaten and battered, but it\'s more than serviceable for disguise.',
                    isTakeable: false,
                    onTake(){
                        println('Try using it, not taking it.');
                    },
                    onUse(){
                        if(getItemInInventory('rusted sword')){
                            println('You put on the gambeson, chainmail, and plate armour on yourself; it feels gross.');
                            println('With this disguise on, you\'ll pass as a guard, albeit lazy to clean his uniform.');
                            println('Now you\'re ready to head upstairs using the stairway EAST of the \'underground chamber\'.');
                            delete getExit('east', getRoom('intro_chamber').exits).block;
                        } else{
                            println('You\'ll need a weapon to complete the look first.');
                        }
                    }
                }
            ],
            exits: [
                {
                    dir: 'east',
                    id: 'intro_chamber',
                }
            ],
        },
        {
            id: 'intro_lobby',
            img: '==================================================================================================\n',
            name: 'Prison Entrance\n' +
                '==================================================================================================\n',
            desc: 'As you walk up the stairs, you can hear the frantic footsteps of soldiers around the room above.\n' +
                  'Upon reaching the room at the end of the stairs, you find the guards have lined up into a neat\n' +
                  'line facing a man in gold-studded armor. He must be the captain, you think to yourself.\n\n' +

                  'Before your mind is allowed to think any further, another guard grabs your shoulder and shoves\n' +
                  'you to the line. It seems the disguise worked, though now you\'re in a real bind.\n' +
                  'As the captain finishes looking around, he starts shouting:\n\n' +

                  '"Alright listen up you good-for-nothing milksops. I\'m not going to spend more time than I need to\n' +
                  'getting this order out so listen nice and closely, cus\' I won\'t be repeating myself."\n' +
                  '"How many of you are there... six, seven, eight... alright there\'s 13 of you. I want 2 people\n' +
                  'patrol in the outer walls, 6 patrolling the town centre, and the rest of you are on cleaning duty."\n\n' +

                  'Murmurs fill the room as people assign themselves to the roles.\n' +
                  'Yet another hand reaches over your shoulder again,\n' +
                  'a seemingly old guardsman takes a second looking at you and says:\n\n' +

                  '"Hey, Agustin right? Heard you were new around here, so I\'ll let you join me and the lads\n' +
                  'on patrol in the town centre. Be warned, we\'ll leave you behind if you don\'t keep up."\n\n' +

                  'It seems lady luck has shined upon your sorry ass yet again, the guard mistook you for a new guy\n' +
                  'so it\'s best to take advantage of that and get out of here using the town patrol.\n\n' +

                  '=| END OF DEMO A02 |=',
        },

    ],
});