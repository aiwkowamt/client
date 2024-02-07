export default {
    methods: {
        validator(value, rules) {
            for (const rule of rules.split('|')) {
                const [name, param] = rule.split(':');
                if (name === 'required' && !this.validateRequired(value)) {
                    return 'Поле обязательно для заполнения';
                }
                if (name === 'min' && !this.validateMin(value, param)) {
                    return `Минимальная длина поля должна быть ${param} символов`;
                }
                if (name === 'max' && !this.validateMax(value, param)) {
                    return `Максимальная длина поля должна быть ${param} символов`;
                }
                if (name === 'email' && !this.validateEmail(value)) {
                    return 'Пожалуйста, введите корректный адрес электронной почты';
                }
                if (name === 'include' && !this.validateInclude(value, param)) {
                    return `Поле должно содержать слово "${param}"`;
                }
                if (name === 'size' && !this.validateSize(value, param)) {
                    return `Длина поля должна быть ${param} символов`;
                }
                if (name === 'integer' && !this.validateInteger(value)) {
                    return 'Поле должно быть целым числом';
                }
            }
        },
        validateRequired(value) {
            if (value === null || value === undefined) {
                return false;
            }
            if (typeof value === 'string') {
                return !!value.trim();
            }
            return true;
        },
        validateEmail(value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value);
        },
        validateMin(value, minLength) {
            return value.length >= parseInt(minLength);
        },
        validateMax(value, maxLength) {
            return value.length <= parseInt(maxLength);
        },
        validateInclude(value, includedValue) {
            return value.includes(includedValue);
        },
        validateSize(value, size) {
            return value.length === parseInt(size);
        },
        validateInteger(value) {
            return Number.isInteger(Number(value));
        },
    }
};
