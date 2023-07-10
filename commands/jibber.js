const { SlashCommandBuilder , EmbedBuilder } = require('discord.js');
const config = require('../config.json');

function jibber(length, punctuate, punctuationMarks, wordLengthLimit, mimicEnglishPractices) {
    length = typeof length !== `undefined` ? length : 1;
    punctuate = typeof punctuate !== `undefined` ? punctuate : false;
    punctuationMarks = typeof punctuationMarks !== `undefined` ? punctuationMarks : [".", "!", "?", "..."];

    const cv = 'aeiou';
    const cc = 'bcdfghjklmnprstvw';
    const ccx = 'qxzy';
    const cca = 'bcdfghjklmnpqrstvwxyz'

    const nonEnglishCombinations = ['mp', 'lw', 'wp', 'kg', 'fz', 'uo', 'aa', 'bx', 'cx', 'dx', 'fx', 'gx', 'hx', 'hh', 'jx', 'jj', 'kx', 'kk', 'lx', 'mx', 'nx', 'px', 'rx', 'sx', 'tx', 'vx', 'vv', 'wx', 'ww', 'bz', 'cq', 'fq', 'gj', 'jq', 'jz', 'kq', 'qv', 'qj', 'qx', 'qz', 'vx', 'vz', 'wx', 'wz', 'xz', 'zx', 'uu', 'ii'];

    function getPunc() {
        return punctuationMarks[Math.floor(Math.random() * punctuationMarks.length)];
    }

    let sentence = [];
    let letterCount = 0;
    let word = [];
    let bounty = 0;
    for (let i = 0; i < length; i++) {
        if (!wordLengthLimit) {
            letterCount = Math.floor(Math.random() * 10) + 2;
        } else {
            letterCount = wordLengthLimit;
        }
        for (let i = 0; i < letterCount; i++) {
            function returnUniqueRandomChar(lastTwo, possibleCharacters) {
                let unique;
                while (true) {
                    unique = possibleCharacters[Math.floor(Math.random() * possibleCharacters.length)];
                    if (!lastTwo.includes(unique)) {
                        break;
                    };
                };
                return unique;
            };
            function addV(letterHistory) {
                let proposal;
                if (letterHistory[0] === letterHistory[1]) {
                    proposal = returnUniqueRandomChar(letterHistory.join(``), cv)
                } else {
                    proposal = cv[Math.floor(Math.random() * cv.length)];
                };
                word.push(proposal);
            };
            function addC(letterHistory) {
                if (Math.floor(Math.random() * 10) === 0) {
                    let proposal;
                    if (letterHistory[0] === letterHistory[1]) {
                        proposal = returnUniqueRandomChar(letterHistory.join(``), ccx)
                    } else {
                        proposal = ccx[Math.floor(Math.random() * ccx.length)];
                    };
                    word.push(proposal);
                } else {
                    let proposal;
                    if (letterHistory[0] === letterHistory[1]) {
                        proposal = returnUniqueRandomChar(letterHistory.join(``), cc)
                    } else {
                        proposal = cc[Math.floor(Math.random() * cc.length)];
                    };
                    word.push(proposal);
                };
            };
            let rollBountyClaim = Math.floor(Math.random() * bounty);
            let lastTwoLetters = word.slice(-2);
            if (rollBountyClaim === 0) {
                if (Math.random() < 0.5) {
                    addV(lastTwoLetters);
                    bounty = 10;
                } else {
                    addC(lastTwoLetters);
                    bounty = -10;
                };
            } else if (rollBountyClaim > 0) {
                addV(lastTwoLetters);
                bounty = bounty - 33;
            } else if (rollBountyClaim < 0) {
                addC(lastTwoLetters);
                bounty = bounty + 33;
            };

        };
        if (mimicEnglishPractices) {
            word = word.filter((char, i) => char !== word[i - 1] || char !== word[i - 2] || i < 2);
            
            word = (word => (
                word.join(``)
                    .replace(/([aeiou])\1{1,3}/gi, '$1')
                    .replace(/[aeiou]/gi, (char) => Math.random() < 0.5 ? '' : char)
                    .replace(/([aeiou])\1+/gi, '$1')
                    .split(``)
            ))(word);

            word = ((inputWord) => {
                const isDoubleConsonant = chars => (cca => chars.some((c, i) => i < chars.length - 1 && cca.includes(c) && c === chars[i + 1]))('bcdfghjklmnpqrstvwxyz');
                const getRandomVowel = () => cv[Math.floor(Math.random() * cv.length)];

                const modifiedWord = [...inputWord];

                if (modifiedWord.length >= 2 && isDoubleConsonant(modifiedWord.slice(0, 2))) {
                    modifiedWord.splice(0, 1, getRandomVowel());
                }
            
                const finalResult = modifiedWord.join('').replace(/([aeiou])\1+/gi, '$1');
            
                modifiedWord.forEach((char, i, arr) => {
                    if (/[aeiou]/.test(char) && arr[i - 1] === char) {
                        arr[i] = Math.random() < 0.5 ? '' : char;
                    }
                });
            
                return word
            })(word);

            word = word.map(letter => letter === "q" ? "qu" : letter)

            for (let i = 0; i < word.length * 20; i++) {
                word = word.map((letter, i) => {
                    const twoLetterItem = word.slice(i, i + 2).join('');
                    const combination = nonEnglishCombinations.find(item => item === twoLetterItem);
                    if (combination === undefined) { return letter }
                    if (combination) {
                        const replacementLetter = combination.charAt(Math.floor(Math.random() * 2) + 1);
                        const randomVowel = cv[Math.floor(Math.random() * cv.length)];
                        return replacementLetter + randomVowel;
                    }
                    return letter;
                });
            }

            if (word.length <= 4 && RegExp(`^[${cca}]+$`).test(word.join(''))) {
                const randomVowel = cv[Math.floor(Math.random() * cv.length)];
                const randomIndex = Math.floor(Math.random() * (word.length + 1));
                word.splice(randomIndex, 0, randomVowel);
            }
        }
        

        let wordStr = word.join(``);
        sentence.push(wordStr);
        word = [];
    };
    if (punctuate) {
        function punctuate(word) {
            if (Math.floor(Math.random() * 2) === 0) {
                word = word + getPunc();
            } else {
                word = word + `,`;
            };
            return word;
        };
        bounty = 0;
        for (i = 0; i < sentence.length; i++) {
            rollBountyClaim = Math.floor(Math.random() * bounty);
            if (rollBountyClaim <= 0) {
                bounty++;
            } else {
                sentence[i] = punctuate(sentence[i]);
                if (punctuationMarks.includes(sentence[i].charAt(sentence[i].length - 1)) && i != sentence.length) {
                    sentence[i + 1] = sentence[i + 1].charAt(0).toUpperCase() + sentence[i + 1].slice(1);
                    bounty = bounty - 10;
                } else {
                    bounty = bounty - 5;
                };
            };
        };
        sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
        if (sentence.join(` `).charAt(punctuationMarks.includes(sentence.join(` `).length - 1)) || sentence.join(` `).charAt(sentence.join(` `).length - 1) === `,`) {
            sentence[sentence.length - 1] = sentence[sentence.length - 1].replace(/.$/, `.`)
        } else {
            sentence[sentence.length - 1] = sentence[sentence.length - 1] + getPunc();
        };
    };
    return sentence.join(` `);
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`jibber`)
		.setDescription(`Generates a sentence made of fake stuff.`)
		.addIntegerOption(option => option
            .setName(`length`)
			.setDescription(`How many total words to generate.`)
			.setRequired(false)
			.setMaxValue(200)
			.setMinValue(1))
        .addBooleanOption(option => option
            .setName(`punctuate`)
            .setDescription(`Whether or not to add given punctuation marks to the string.`)
            .setRequired(false))
        .addStringOption(option => option
            .setName(`punctuation_marks`)
            .setDescription(`A comma-separated list of punctuation characters to use. Example: ".,!!!,!?, lol ,?"`)
            .setRequired(false)
            .setMinLength(1)
            .setMaxLength(50))
        .addIntegerOption(option => option
            .setName(`word_length_limit`)
            .setDescription(`How long each individual word can be.`)
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(50))
        .addBooleanOption(option => option
            .setName(`mimic_english_practices`)
            .setDescription(`(recommended) Miscellaneous post fixes to make generation more like English.`)
            .setRequired(false))
    ,
	async execute(interaction) {
        const userData = require(`../user_data.json`)
        const length = interaction.options.getInteger(`length`) ?? 20;
        const punctuate = interaction.options.getBoolean(`punctuate`) ?? true;
        let punctuationMarksRaw = interaction.options.getString(`punctuation_marks`) ?? undefined;
        let punctuationMarks = ``;
        if (punctuationMarksRaw) {
            punctuationMarks = punctuationMarksRaw.replace(/^,|,$/g, ``).split(`,`)
        } else {
            punctuationMarks = undefined
        }
        const wordLengthLimit = interaction.options.getInteger(`word_length_limit`) ?? undefined;
        const mimicEnglishPractices = interaction.options.getBoolean(`mimic_english_practices`) ?? false;
		const content = jibber(length, punctuate, punctuationMarks, wordLengthLimit, mimicEnglishPractices);

		const responseEmbed = new EmbedBuilder(config.embedFormat).setTimestamp().setAuthor({name: `/${this.data.name}`}).addFields(
			{
                name: `Configuration`,
                value: `\`\`\`json\n${JSON.stringify({length, punctuate, punctuationMarks, wordLengthLimit, mimicEnglishPractices}, null, 4)}\n\`\`\``
            },
            {
				name: `Generated Jibberish`,
				value: `\`\`\`${content}\`\`\``
			}
		)

		await interaction.reply({ embeds: [responseEmbed], ephemeral: userData[user]?.ephemeral ?? true });
	},
};