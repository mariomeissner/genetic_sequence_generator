"use strict";
/**
 * Sequence of 7 blocks of 4 bits. They represent a genetic string. They can be decoded
 * to a sequence of numbers and operators, each block being one number or operator.
 * Blocks with value below 1010 represent their corresponding integer (ex: 0101 = 5)
 * Blocks with value 1010 or above represent an operator:
 * 1010 = +
 * 1011 = -
 * 1100 = *
 * 1101 = /
 * The remaining possible blocks will be ignored.
 *
 */
class Sequence {
    constructor(sequence) {
        this.originalSequence = sequence;
        this.sequence = sequence;
        this.length = this.originalSequence.length / 4;
        if (!Number.isInteger(this.length)) {
            console.log("ERROR, Bad sequence length");
        }
        this.clean();
    }
    /**
     * Looks for nonsense such as two consecutive operators, consecutive numbers or blocks without meaning.
     * Blocks flagged as nonsense will be deleted leaving a shorter sequence.
     * This should be called before working with the sequence.
     */
    clean() {
        let shouldBeNumber = true; //next block should be a number or not
        let iterator = 0;
        let current;
        let correct;
        while (iterator < this.length) {
            current = this.getBlockValue(iterator);
            //This variable will only resolve to true if the current block is correct
            correct = (shouldBeNumber && current <= 9) || (!shouldBeNumber && current >= 10 && current <= 13);
            if (!correct) {
                this.deleteBlock(iterator);
                //We should not update shouldBeNumber or iterator since a new block has been shifted to current position. 
                continue;
            }
            else {
                shouldBeNumber = !shouldBeNumber;
                iterator++;
            }
        }
        //Now we need to check whether the last block is an operator, and delete it too.
        if (shouldBeNumber) {
            this.deleteBlock(this.length - 1);
        }
    }
    /**
     * Deletes a block of 4 bits of the sequence at indicated position, shifting the rest to the left.
     */
    deleteBlock(position) {
        /**
         * We will create two substrings: The string until the block to be deleted,
         * and the string from that block onwards (not included, obviously).
         */
        let firstPart = this.sequence.substr(0, position * 4);
        let lastPart = this.sequence.substr((position + 1) * 4, this.length * 4 - 1);
        this.sequence = firstPart + lastPart; //Overriding sequence
        this.length--;
    }
    /**
     * POSSIBLY UNNECESSARY SINCE ORIGINAL BITCODE NOW PUBLIC
     * DO WE NEED TO SHOW CLEANED BITCODE?
     * Returns bitcode sequence string as is.
     */
    getBitcode() {
        return this.sequence;
    }
    /**
     * Returns the actual number or operator represented by a block of genetic code
     * A number above 9 indicates an operator.
     * 10 = +; 11 = *; 12 = *; 13 = /
     */
    getBlockValue(position) {
        let block = this.sequence.substr(position * 4, 4);
        return parseInt(block, 2);
    }
    /**
     * Returns the decrypted string corresponding to the cleaned bitcode.
     */
    decode() {
        let iterator = 0;
        let string = "";
        let current;
        while (iterator < this.length) {
            current = this.getBlockValue(iterator);
            if (current <= 9) {
                string += current;
            }
            else {
                switch (current) {
                    case 10:
                        string += " + ";
                        break;
                    case 11:
                        string += " - ";
                        break;
                    case 12:
                        string += " * ";
                        break;
                    case 13:
                        string += " / ";
                        break;
                    default:
                        string += " NaN ";
                }
            }
            iterator++;
        }
        return string;
    }
    /**
     * Returns the outcome value of the sequence according to its representation
     * Uses JS eval function, which is why we needed to clean the
     */
    evaluate() {
        return eval(this.decode());
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Sequence;