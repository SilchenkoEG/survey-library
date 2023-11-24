import { Serializer } from "../src/jsonobject";
import { QuestionSignaturePadModel } from "../src/question_signaturepad";
import { SurveyModel } from "../src/survey";

export default QUnit.module("question signaturepad");

QUnit.test("QuestionSignaturePadModel dataFormat default value", function (
  assert
) {
  var question = new QuestionSignaturePadModel("q");
  assert.equal(question.dataFormat, "png", "default value");
});

QUnit.test("QuestionSignaturePadModel dataFormat values", function (assert) {
  var question = new QuestionSignaturePadModel("q");
  assert.equal(question.dataFormat, "png", "defaultValue");

  var el = document.createElement("div");
  el.appendChild(document.createElement("canvas"));
  el.appendChild(document.createElement("button"));
  question.initSignaturePad(el);

  question["updateValue"]();
  assert.equal(question.value.substring(0, 15), "data:image/png;", "png");

  question.dataFormat = "image/jpeg";
  assert.equal(question.dataFormat, "jpeg", "jpeg format");
  question["updateValue"]();
  assert.equal(question.value.substring(0, 15), "data:image/jpeg", "jpeg");

  question.dataFormat = "image/svg+xml";
  assert.equal(question.dataFormat, "svg", "svg format");
  question["updateValue"]();
  assert.equal(question.value.substring(0, 15), "data:image/svg+", "svg");

  question.dataFormat = "jpeg";
  assert.equal(question.dataFormat, "jpeg", "jpeg format");
  question["updateValue"]();
  assert.equal(question.value.substring(0, 15), "data:image/jpeg", "jpeg#2");

  question.dataFormat = "svg";
  assert.equal(question.dataFormat, "svg", "svg format");
  question["updateValue"]();
  assert.equal(question.value.substring(0, 15), "data:image/svg+", "svg#2");

  question.dataFormat = "png";
  assert.equal(question.dataFormat, "png", "png format");
  question["updateValue"]();
  assert.equal(question.value.substring(0, 15), "data:image/png;", "png#2");

  question.dataFormat = "";
  assert.equal(question.dataFormat, "png", "png format");
  question["updateValue"]();
  assert.equal(question.value.substring(0, 15), "data:image/png;", "png#3");

  el.remove();
});
QUnit.test("QuestionSignaturePadModel dataFormat converters", function (assert) {
  var question = new QuestionSignaturePadModel("q");
  assert.equal(question.dataFormat, "png", "#1");
  question.fromJSON({ name: "q", dataFormat: "jpeg" });
  assert.equal(question.dataFormat, "jpeg", "#2");
  question.fromJSON({ name: "q", dataFormat: "svg" });
  assert.equal(question.dataFormat, "svg", "#3");
  question.fromJSON({ name: "q", dataFormat: "dffd" });
  assert.equal(question.dataFormat, "png", "#4");
  question.fromJSON({ name: "q", dataFormat: "image/jpeg" });
  assert.equal(question.dataFormat, "jpeg", "#5");
  question.fromJSON({ name: "q", dataFormat: "image/svg+xml" });
  assert.equal(question.dataFormat, "svg", "#6");
});
QUnit.test("check allowClear", (assert) => {
  var json = {
    questions: [
      {
        type: "signaturepad",
        name: "q1"
      },
    ],
  };
  const survey = new SurveyModel(json);
  const signaturepad = <QuestionSignaturePadModel>survey.getQuestionByName("q1");
  assert.equal(signaturepad.allowClear, true, "allowClear");
  assert.equal(signaturepad.readOnly, false, "readOnly");
  assert.equal(signaturepad.canShowClearButton, true, "canShowClearButton");

  signaturepad.allowClear = false;
  assert.equal(signaturepad.allowClear, false, "allowClear");
  assert.equal(signaturepad.readOnly, false, "readOnly");
  assert.equal(signaturepad.canShowClearButton, false, "canShowClearButton");
});

QUnit.test("Check signaturepad signauteWidth/Height properties", (assert) => {
  var json: any = {
    questions: [
      {
        type: "signaturepad",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const containerEl = document.createElement("div");
  const canvas = document.createElement("canvas");
  containerEl.appendChild(canvas);
  const signaturepad = <QuestionSignaturePadModel>survey.getQuestionByName("q1");
  const ratio = 1;
  signaturepad.initSignaturePad(containerEl);
  assert.equal(signaturepad.signatureWidth, 300);
  assert.equal(signaturepad.signatureHeight, 200);
  assert.equal(canvas.width, 300 * ratio);
  assert.equal(canvas.height, 200 * ratio);
  signaturepad.signatureWidth = 400;
  signaturepad.signatureHeight = 300;
  assert.equal(canvas.width, 400 * ratio);
  assert.equal(canvas.height, 300 * ratio);

  canvas.remove();
  containerEl.remove();
});
//todo: need to remove this test after code modification
QUnit.test("Check width/height influence on signageWidth/Height properties", (assert) => {
  let json: any = {
    questions: [
      {
        type: "signaturepad",
        name: "q1",
        width: 400,
        height: 300
      },
    ],
  };
  const containerEl = document.createElement("div");
  const canvas = document.createElement("canvas");
  containerEl.appendChild(canvas);
  let survey = new SurveyModel(json);
  let signaturepad = <QuestionSignaturePadModel>survey.getQuestionByName("q1");
  signaturepad.initSignaturePad(containerEl);
  assert.equal(signaturepad.signatureWidth, 400);
  assert.equal(signaturepad.signatureHeight, 300);
  assert.equal(canvas.width, 400);
  assert.equal(canvas.height, 300);

  json = {
    questions: [
      {
        type: "signaturepad",
        name: "q1",
        width: "400",
      },
    ],
  };
  survey = new SurveyModel(json);
  signaturepad = <QuestionSignaturePadModel>survey.getQuestionByName("q1");
  signaturepad.initSignaturePad(containerEl);
  assert.equal(signaturepad.signatureWidth, 300);
  assert.equal(canvas.width, 300);

  json = {
    questions: [
      {
        type: "signaturepad",
        name: "q1",
        signatureWidth: 400,
        signatureHeight: 300,
        width: 600,
        height: 600
      },
    ],
  };
  survey = new SurveyModel(json);
  signaturepad = <QuestionSignaturePadModel>survey.getQuestionByName("q1");
  signaturepad.initSignaturePad(containerEl);
  assert.equal(signaturepad.signatureWidth, 400);
  assert.equal(canvas.width, 400);
  assert.equal(signaturepad.signatureHeight, 300);
  assert.equal(canvas.height, 300);

  canvas.remove();
  containerEl.remove();
});

QUnit.test("check penColor & background color from json", (assert) => {
  const json = {
    questions: [
      {
        type: "signaturepad",
        name: "q1",
        penColor: "#e92525",
        backgroundColor: "#dde6db"
      },
    ],
  };
  const containerEl = document.createElement("div");
  const canvas = document.createElement("canvas");
  containerEl.appendChild(canvas);
  let survey = new SurveyModel(json);
  let signaturepadQuestion = <QuestionSignaturePadModel>survey.getQuestionByName("q1");
  signaturepadQuestion.initSignaturePad(containerEl);

  assert.equal(signaturepadQuestion.penColor, "#e92525", "penColor init");
  assert.equal(signaturepadQuestion.backgroundColor, "#dde6db", "backgroundColor init");
  assert.equal(signaturepadQuestion.signaturePad.penColor, "#e92525", "signaturePad.penColor init");
  assert.equal(signaturepadQuestion.signaturePad.backgroundColor, "#dde6db", "signaturePad.backgroundColor init");

  survey.applyTheme({ "cssVariables": { "--sjs-primary-backcolor": "rgba(103, 58, 176, 1)" } });
  assert.equal(signaturepadQuestion.penColor, "#e92525", "penColor init");
  assert.equal(signaturepadQuestion.backgroundColor, "#dde6db", "backgroundColor init");
  assert.equal(signaturepadQuestion.signaturePad.penColor, "#e92525", "signaturePad.penColor init");
  assert.equal(signaturepadQuestion.signaturePad.backgroundColor, "#dde6db", "signaturePad.backgroundColor init");

  survey.applyTheme({ "cssVariables": {} });
  assert.equal(signaturepadQuestion.penColor, "#e92525", "penColor init");
  assert.equal(signaturepadQuestion.backgroundColor, "#dde6db", "backgroundColor init");
  assert.equal(signaturepadQuestion.signaturePad.penColor, "#e92525", "signaturePad.penColor init");
  assert.equal(signaturepadQuestion.signaturePad.backgroundColor, "#dde6db", "signaturePad.backgroundColor init");
});

QUnit.test("check penColor & background color from theme", (assert) => {
  const json = {
    questions: [
      {
        type: "signaturepad",
        name: "q1",
      },
    ],
  };
  const containerEl = document.createElement("div");
  const canvas = document.createElement("canvas");
  containerEl.appendChild(canvas);
  let survey = new SurveyModel(json);
  let signaturepadQuestion = <QuestionSignaturePadModel>survey.getQuestionByName("q1");
  signaturepadQuestion.initSignaturePad(containerEl);

  assert.equal(signaturepadQuestion.penColor, undefined, "penColor undefined");
  assert.equal(signaturepadQuestion.backgroundColor, undefined, "backgroundColor undefined");
  assert.equal(signaturepadQuestion.signaturePad.penColor, "#1ab394", "signaturePad.penColor default");
  assert.equal(signaturepadQuestion.signaturePad.backgroundColor, "#ffffff", "signaturePad.backgroundColor default");

  survey.applyTheme({ "cssVariables": { "--sjs-primary-backcolor": "rgba(103, 58, 176, 1)" } });
  assert.equal(signaturepadQuestion.penColor, undefined, "penColor undefined");
  assert.equal(signaturepadQuestion.backgroundColor, undefined, "backgroundColor undefined");
  assert.equal(signaturepadQuestion.signaturePad.penColor, "rgba(103, 58, 176, 1)", "signaturePad.penColor from theme");
  assert.equal(signaturepadQuestion.signaturePad.backgroundColor, "transparent", "signaturePad.backgroundColor from theme");

  survey.applyTheme({ "cssVariables": {} });
  assert.equal(signaturepadQuestion.penColor, undefined, "penColor undefined");
  assert.equal(signaturepadQuestion.backgroundColor, undefined, "backgroundColor undefined");
  assert.equal(signaturepadQuestion.signaturePad.penColor, "#1ab394", "signaturePad.penColor default");
  assert.equal(signaturepadQuestion.signaturePad.backgroundColor, "#ffffff", "signaturePad.backgroundColor default");
});

QUnit.test("check penColor & background color if background image", (assert) => {
  const json = {
    questions: [
      {
        type: "signaturepad",
        backgroundImage: "someUrl",
        name: "q1",
      },
    ],
  };
  const containerEl = document.createElement("div");
  const canvas = document.createElement("canvas");
  containerEl.appendChild(canvas);
  let survey = new SurveyModel(json);
  let signaturepadQuestion = <QuestionSignaturePadModel>survey.getQuestionByName("q1");
  signaturepadQuestion.initSignaturePad(containerEl);

  assert.equal(signaturepadQuestion.penColor, undefined, "penColor undefined");
  assert.equal(signaturepadQuestion.backgroundColor, undefined, "backgroundColor undefined");
  assert.equal(signaturepadQuestion.signaturePad.penColor, "#1ab394", "signaturePad.penColor #1ab394");
  assert.equal(signaturepadQuestion.signaturePad.backgroundColor, "transparent", "signaturePad.backgroundColor transparent");

  survey.applyTheme({ "cssVariables": { "--sjs-primary-backcolor": "rgba(103, 58, 176, 1)" } });
  assert.equal(signaturepadQuestion.penColor, undefined, "penColor undefined");
  assert.equal(signaturepadQuestion.backgroundColor, undefined, "backgroundColor undefined");
  assert.equal(signaturepadQuestion.signaturePad.penColor, "rgba(103, 58, 176, 1)", "signaturePad.penColor from theme");
  assert.equal(signaturepadQuestion.signaturePad.backgroundColor, "transparent", "signaturePad.backgroundColor from theme");

  survey.applyTheme({ "cssVariables": {} });
  assert.equal(signaturepadQuestion.penColor, undefined, "penColor undefined");
  assert.equal(signaturepadQuestion.backgroundColor, undefined, "backgroundColor undefined");
  assert.equal(signaturepadQuestion.signaturePad.penColor, "#1ab394", "signaturePad.penColor #1ab394");
  assert.equal(signaturepadQuestion.signaturePad.backgroundColor, "transparent", "signaturePad.backgroundColor transparent");

  signaturepadQuestion.backgroundColor = "#dde6db";
  assert.equal(signaturepadQuestion.penColor, undefined, "penColor undefined");
  assert.equal(signaturepadQuestion.backgroundColor, "#dde6db", "backgroundColor #dde6db");
  assert.equal(signaturepadQuestion.signaturePad.penColor, "#1ab394", "signaturePad.penColor #1ab394");
  assert.equal(signaturepadQuestion.signaturePad.backgroundColor, "transparent", "signaturePad.backgroundColor transparent");
});

QUnit.test("check showPlaceholder & placeholder properties", (assert) => {
  let json: any = {
    questions: [
      {
        type: "signaturepad",
        backgroundImage: "someUrl",
        name: "q1",
      },
    ],
  };
  let survey = new SurveyModel(json);
  let question = <QuestionSignaturePadModel>survey.getAllQuestions()[0];
  assert.ok(question.needShowPlaceholder());
  assert.equal(question.locPlaceholder.renderedHtml, "Sign here");

  question.showPlaceholder = false;
  assert.notOk(question.needShowPlaceholder());
  question.placeholder = "test sign";
  assert.equal(question.locPlaceholder.renderedHtml, "test sign");

  json = {
    questions: [
      {
        type: "signaturepad",
        backgroundImage: "someUrl",
        name: "q1",
        showPlaceholder: false,
        placeHolder: "test sign"
      },
    ],
  };
  survey = new SurveyModel(json);
  question = <QuestionSignaturePadModel>survey.getAllQuestions()[0];
  assert.notOk(question.needShowPlaceholder());
  question.placeholder = "test sign";
  assert.equal(question.locPlaceholder.renderedHtml, "test sign");
});

QUnit.test("check placeholder property visibility", (assert) => {
  const prop1 = Serializer.getProperty("signaturepad", "placeholder");
  assert.deepEqual(Serializer.getProperty("signaturepad", "showPlaceholder").getDependedProperties(), [prop1.name]);
  const q1 = new QuestionSignaturePadModel("q1");
  q1.showPlaceholder = true;
  assert.equal(prop1.isVisible(undefined, q1), true);
  q1.showPlaceholder = false;
  assert.equal(prop1.isVisible(undefined, q1), false);
});

QUnit.test("check rendered size properties", (assert) => {
  const json = {
    questions: [
      {
        type: "signaturepad",
        name: "q1",
        "penColor": "#ff0000"
      },
    ],
  };
  const containerEl = document.createElement("div");
  const canvas = document.createElement("canvas");
  containerEl.appendChild(canvas);
  let survey = new SurveyModel(json);
  let signaturepadQuestion = <QuestionSignaturePadModel>survey.getQuestionByName("q1");
  signaturepadQuestion.initSignaturePad(containerEl);

  assert.equal(signaturepadQuestion.renderedCanvasWidth, "300px");

  signaturepadQuestion.signatureWidth = 500;

  assert.equal(signaturepadQuestion.renderedCanvasWidth, "500px");

  signaturepadQuestion.signatureAutoScaleEnabled = true;
  assert.equal(signaturepadQuestion.renderedCanvasWidth, "100%");
});

// QUnit.only("Question Signature upload files", function (assert) {
//   var json = {
//     questions: [
//       {
//         type: "signaturepad",
//         name: "signature",
//         storeDataAsText: false,
//       },
//     ],
//   };

//   var survey = new SurveyModel(json);
//   var q1: QuestionSignaturePadModel = <any>survey.getQuestionByName("signature");
//   var done = assert.async();

//   var fileName;
//   var fileType;
//   var fileContent;
//   survey.onUploadFiles.add((survey, options) => {
//     let file = options.files[0];
//     let fileReader = new FileReader();
//     fileReader.onload = (e) => {
//       fileName = file.name;
//       fileType = file.type;
//       fileContent = fileReader.result;
//     };
//     fileReader.readAsDataURL(file);

//     setTimeout(
//       () =>
//         options.callback(
//           "success",
//           options.files.map((file) => {
//             return { file: file, content: file.name + "_url" };
//           })
//         ),
//       2
//     );
//   });

//   q1["signaturePad"].fromDataURL("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100' width='100'%3E%3Ccircle cx='50' cy='50' r='40' /%3E%3C/svg%3E");
//   q1.onBlur();

//   survey.onValueChanged.add((survey, options) => {
//     assert.equal(q1.value.length, 1, "2 file");
//     assert.equal(
//       q1.value[0].content,
//       q1.value[0].name + "_url",
//       "content"
//     );

//     done();

//     assert.equal(fileType, "image/svg+xml");
//     assert.equal(fileName, "signature.SVG");
//     assert.equal(fileContent, "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100' width='100'%3E%3Ccircle cx='50' cy='50' r='40' /%3E%3C/svg%3E");
//   });
// });
