import { HashTable } from "survey-core";

export class ReactQuestionFactory {
  public static Instance: ReactQuestionFactory = new ReactQuestionFactory();
  private creatorHash: HashTable<(name: string) => React.JSX.Element> = {};

  public registerQuestion(
    questionType: string,
    questionCreator: (name: string) => React.JSX.Element
  ) {
    this.creatorHash[questionType] = questionCreator;
  }
  public getAllTypes(): Array<string> {
    var result = new Array<string>();
    for (var key in this.creatorHash) {
      result.push(key);
    }
    return result.sort();
  }
  public createQuestion(questionType: string, params: any): React.JSX.Element | null {
    var creator = this.creatorHash[questionType];
    if (creator == null) return null;
    return creator(params);
  }
}
