/**
 * Created by ptmind on 2018/4/4.
 */
import Var from '../../observer/Var';
import __array__ from '../../languageParser/array';
import __runObj__ from '../../languageParser/__runObj__';
import __dictionary__ from '../../languageParser/dictionary';
import dictionaryGet from '../../languageParser/dictionaryGet';
function getOptionByObj(obj) {
    let returnOption = {};
    if (['boolean', 'number', 'string'].includes(typeof obj)) {
        returnOption = obj;
    }
    else if (obj instanceof __array__) {
        returnOption = {
            type: 'array',
            props: []
        };
        obj.value_.forEach((item) => {
            returnOption.props.push(getOptionByObj(item));
        });
    }
    else if (obj instanceof __dictionary__) {
        returnOption = {
            type: 'dict',
            props: obj.map
        };
    }
    else if (obj instanceof dictionaryGet) {
        returnOption = {
            type: 'dictionaryGet',
            dictionary: getOptionByObj(obj.dictionary),
            keys: obj.dictionary.value,
            key: obj.key
        };
    }
    else if (obj instanceof Var) {
        returnOption = {
            type: 'var',
            name: obj.name,
            value: obj.value
        };
    }
    else if (obj instanceof __runObj__) {
        returnOption = {
            type: 'runObj',
            name: '',
            props: []
        };
        obj.params.forEach(item => {
            returnOption.props.push(getOptionByObj(item));
        });
    }
    else {
        returnOption = {
            type: obj.type,
            name: obj.name,
            props: []
        };
        obj.props.forEach(item => {
            returnOption.props.push(getOptionByObj(item));
        });
    }
    return returnOption;
}
export default getOptionByObj;
