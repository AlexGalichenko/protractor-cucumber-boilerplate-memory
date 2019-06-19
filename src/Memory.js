/**
 * Class representing Memory
 * @type {Memory}
 */
class Memory {

    /**
     * Set computed instance
     * @example Memory.setComputedInstance(new yourComputedInstance())
     * @param {AbstractComputedMap} computedInstance - instance of computed map
     */
    static setComputedInstance(computedInstance) {
        if (this.computedInstance) {
            this.computedInstance.computed = this.computedInstance.computed.concat(computedInstance.computed)
        } else {
            this.computedInstance = computedInstance;
        }
    }

    /**
     * Set computed instances
     * @example Memory.setComputedInstances([
     *      new yourComputedInstance(),
     *      new yourComputedInstance2()
     *  ])
     * @param {Array<AbstractComputedMap>} computedInstances - instance of computed map
     */
    static setComputedInstances(computedInstances) {
        if (this.computedInstance) {
            this.computedInstance.computed = this.computedInstance.computed.concat(...computedInstances.map(instance => instance.computed));
        } else {
            this.computedInstance = computedInstances.pop();
            this.computedInstance.computed = this.computedInstance.computed.concat(...computedInstances.map(instance => instance.computed));
        }
    }

    /**
     * Set constant instance
     * @example Memory.setConstantsInstance(new yourConstantsInstance())
     * @param {AbstractConstantMap} constantsInstance - instance of constants map
     */
    static setConstantsInstance(constantsInstance) {
        if (this.constantsInstance) {
            this.constantsInstance.constants = Object.assign(this.constantsInstance.constants, constantsInstance.constants);
            this.constantsInstance.fileConstants = Object.assign(this.constantsInstance.fileConstants, constantsInstance.fileConstants);
        } else {
            this.constantsInstance = constantsInstance;
        }
    }

    /**
     * Set constant instance
     * @example Memory.setConstantsInstances([
     *      new yourConstantsInstance(),
     *      new yourConstantsInstance2()
     * ])
     * @param {Array<AbstractConstantMap>} constantsInstances - instances of constants map
     */
    static setConstantsInstances(constantsInstances) {
        if (this.constantsInstance) {
            this.constantsInstance.constants = Object.assign(this.constantsInstance.constants, ...constantsInstances.map(instance => instance.constants));
            this.constantsInstance.fileConstants = Object.assign(this.constantsInstance.fileConstants, ...constantsInstances.map(instance => instance.fileConstants));
        } else {
            this.constantsInstance = constantsInstances.pop();
            this.constantsInstance.constants = Object.assign(this.constantsInstance.constants, ...constantsInstances.map(instance => instance.constants));
            this.constantsInstance.fileConstants = Object.assign(this.constantsInstance.fileConstants, ...constantsInstances.map(instance => instance.fileConstants));
        }
    }

    /**
     * Bind value to memory class
     * @param {string} key - key
     * @param {*} value - value
     * @example Memory.setValue("key", 1)
     */
    static setValue(key, value) {
        if (!this.memory) {
            this.memory = {}
        }

        this.memory[key] = value;
    }

    /**
     * Returns value if exists in memory
     * @param {string} key - key
     * @return {string|number|Object} - parsed value
     * @throws {Error}
     * @example Memory.parseValue("$key")
     */
    static parseValue(key) {
        const MEMORY_REGEXP = /^(\$|#|!{1,2})?([^$#!]?.+)$/;

        if (MEMORY_REGEXP.test(key)) {
            const [_, prefix, parsedKey] = key.match(MEMORY_REGEXP);
            switch (prefix) {
                case "$": return this._getMemoryValue(parsedKey);
                case "#": return this._getComputedValue(parsedKey);
                case "!": return this._getConstantValue(parsedKey);
                case "!!": return this._getFileConstantValue(parsedKey);
                case undefined: return parsedKey;
                default: throw new Error(`${parsedKey} is not defined`)
            }
        } else {
            return key
        }
    }

    /**
     * Return value from memory
     * @param {string} alias - key
     * @return {string|number|Object} - value by key
     * @private
     */
    static _getMemoryValue(alias) {
        if (this.memory[alias] !== undefined) {
            return this.memory[alias];
        } else {
            throw new Error(`Value ${alias} doesn't exist in memory`)
        }
    }

    /**
     * Return calculated value
     * @param {string} alias - key
     * @return {string|number|Object} - value by key
     * @private
     */
    static _getComputedValue(alias) {
        if (this.computedInstance) {
            return this.computedInstance.getComputed(alias)
        }
        else throw new Error(`Instance of computed is not defined`)
    }

    /**
     * Return constant value
     * @param {string} key - key
     * @return {string|number|Object} - value by key
     * @private
     */
    static _getConstantValue(key) {
        if (this.constantsInstance) {
            return this.constantsInstance.getConstant(key)
        }
        else throw new Error(`Instance of constants is not defined`)
    }

    /**
     * Return file constant value
     * @param {string} key - key
     * @return {string|Buffer} - value by key
     * @private
     */
    static _getFileConstantValue(key) {
        if (this.constantsInstance) {
            return this.constantsInstance.getFileConstant(key)
        }
        else throw new Error(`Instance of constants is not defined`)
    }

}

module.exports = Memory;
