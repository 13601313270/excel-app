/**
 * Created by ptmind on 2018/3/30.
 */
import __allMatch__ from '../languageParser/allMatch';
import funcLanguageParser from '../languageParser/functionCall';
import FuncObj from './FuncObj';

class relationalModelMerge extends FuncObj {
    constructor(mergeType) {
        super(...Array.from(arguments));
        this.mergeType = mergeType;
        this.allRelation = Array.from(arguments).slice(1);
        this.props = Array.from(arguments);
        this.name = 'RELATIONAL_MODEL_MERGE';
    }

    checkParams() {
        if(this.allRelation.length > 0) {
            let allOk = true;
            this.allRelation.forEach(item => {
                allOk = allOk && item.value && (item.value.type === 'relationalModel');
            });
            return allOk;
        } else {
            return false;
        }
    }

    get value() {
        let self = this;
        if(this.checkParams()) {
            if(this.mergeType === 'merge') {
                return {
                    type: 'relationalModel',
                    groupColumn: this.allRelation[0].value.groupColumn,
                    dataColumn: (function() {
                        let returnArr = [];
                        self.allRelation.map(item => {
                            returnArr.push(...item.value.dataColumn);
                        });
                        return returnArr;
                    })(),
                    dataValue: this.allRelation[0].value.dataValue.map((item, key) => {
                        let returnArr = Array.from(item);
                        let findMatchInfo = {};
                        this.allRelation[0].value.groupColumn.forEach((item2, key2) => {
                            findMatchInfo[item2] = returnArr[key2];
                        });
                        this.allRelation.slice(1).forEach(relationItem => {
                            let find = relationItem.value.dataValue.find(item2 => {
                                let isMatch = true;
                                Object.keys(findMatchInfo).forEach(matchKey => {
                                    isMatch = isMatch && findMatchInfo[matchKey] === item2[relationItem.value.groupColumn.indexOf(matchKey)];
                                });
                                return isMatch;
                            });
                            if(find) {
                                returnArr.push(...find.slice(relationItem.value.groupColumn.length));
                            } else {
                                returnArr.push(...Array(relationItem.value.groupColumn.length).fill(null));
                            }
                        });
                        return returnArr;
                    })
                };
            } else if(this.mergeType === 'add') {
                return {
                    type: 'relationalModel',
                    groupColumn: this.allRelation[0].value.groupColumn,
                    dataColumn: (function() {
                        return ['count'];
                    })(),
                    dataValue: this.allRelation[0].value.dataValue.map((item, key) => {
                        let returnArr = Array.from(item);
                        let findMatchInfo = {};// 转换成键值对
                        this.allRelation[0].value.groupColumn.forEach((columnName, columnIndex) => {
                            findMatchInfo[columnName] = returnArr[columnIndex];
                        });
                        this.allRelation.slice(1).forEach(relationItem => {
                            let find = relationItem.value.dataValue.find(item2 => {
                                let isMatch = true;
                                Object.keys(findMatchInfo).forEach(matchKey => {
                                    isMatch = isMatch && findMatchInfo[matchKey] === item2[relationItem.value.groupColumn.indexOf(matchKey)];
                                });
                                return isMatch;
                            });
                            if(find) {
                                find.slice(relationItem.value.groupColumn.length).forEach(num => {
                                    returnArr[1] += parseInt(num);
                                });
                                // returnArr.push(...find.slice(relationItem.value.groupColumn.length));
                            } else {
                                // returnArr.push(...Array(relationItem.value.groupColumn.length).fill(null));
                            }
                        });
                        return returnArr;
                    })
                };
            }
        } else {
            return null;
        }
    }
}
__allMatch__.push({
    match: /^RELATIONAL_MODEL_MERGE$/,
    type: 'function',
    name: 'RELATIONAL_MODEL_MERGE',
    title: '关系模型合并',
    func: relationalModelMerge,
    value: funcLanguageParser,
    props: [
        {
            name: 'mergeType',
            title: '合并方式',
            dataType: 'string',
            enum: {
                'merge': '合并',
                'add': '累加'
            },
            default: 'merge'
        },
        {
            name: 'tableList',
            title: '表',
            dataType: ['var']
        }
    ],
    returnType: 'relationalModel'
});
export default relationalModelMerge;
