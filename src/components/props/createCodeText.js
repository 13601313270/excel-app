/**
 * Created by ptmind on 2018/4/10.
 */
function createCodeText(innerOption) {
    let code = '';
    if (typeof innerOption === 'string') {
        let beginEndStr = '"';
        if (innerOption.includes('"')) {
            if (!innerOption.includes('\'')) {
                beginEndStr = '\'';
            } else {
                innerOption = innerOption.replace(/"/g, '\\"');
            }
        }
        code = beginEndStr + innerOption + beginEndStr;
    }
    else if (typeof innerOption === 'number') {
        code = innerOption.toString();
    }
    else if (typeof innerOption === 'boolean') {
        code = innerOption ? 'TRUE' : 'FALSE';
    }
    else if (innerOption.type === 'array') {
        code = '[';
        let childArr = [];
        innerOption.props.forEach((item) => {
            childArr.push(createCodeText(item));
        });
        code += childArr.join(',');
        code += ']';
    }
    else if (innerOption.type === 'dict') {
        let props = innerOption.props;
        code = '{';
        let childArr = [];
        for (let i in props) {
            childArr.push(createCodeText(i) + ':' + createCodeText(props[i]));
        }
        code += childArr.join(',');
        code += '}';
    }
    else if (innerOption.type === 'dictionaryGet') {
        code = createCodeText(innerOption.dictionary) + '.' + innerOption.key;
    }
    else if (innerOption.type === 'var') {
        code = innerOption.name;
    }
    else if (['function', 'relationalModel'].includes(innerOption.type)) {
        code += innerOption.name + '(';
        let TempPropArr = [];
        innerOption.props.forEach((item) => {
            TempPropArr.push(createCodeText(item));
        });
        code += TempPropArr.join(',');
        code += ')';
    }
    else if (innerOption.type === 'runObj') {
        code = innerOption.props.map(item => {
            if (['boolean', 'number', 'string'].includes(typeof item)) {
                return item;
            } else {
                return createCodeText(item);
            }
        }).join('');
    }
    return code;
}
export default createCodeText;
