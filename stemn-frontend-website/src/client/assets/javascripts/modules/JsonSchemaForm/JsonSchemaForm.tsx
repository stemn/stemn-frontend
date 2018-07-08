import * as React from 'react';
import Form from "react-jsonschema-form";
// import * as classes from './JsonSchemaForm.scss'
// import DownloadButton from 'stemn-shared/misc/DesktopReleases/DownloadButton'

const schema: any = {
  title: "A registration form",
  description:
    "This is the same as the simple form, but it is rendered as a bootstrap grid. Try shrinking the browser window to see it in action.",
  type: "object",
  required: ["firstName", "lastName"],
  properties: {
    firstName: {
      type: "string",
      title: "First name",
    },
    lastName: {
      type: "string",
      title: "Last name",
    },
    age: {
      type: "integer",
      title: "Age",
    },
    bio: {
      type: "string",
      title: "Bio",
    },
    password: {
      type: "string",
      title: "Password",
      minLength: 3,
    },
    telephone: {
      type: "string",
      title: "Telephone",
      minLength: 10,
    },
  },
}

// function RenderObject({id, classNames, label, help, required, description, errors, children} : any) {

//   return (
//     <div className={classNames}>

//       <label htmlFor={id}>
//         {label}{required ? "*" : null}
//       </label>

//       {description}
//       {children}
//       {/* {errors} */}
//       {/* {help} */}
//     </div>
//   );
// }

// take in error or info

function ObjectFieldTemplate({ TitleField, properties, title, description } : any) {
  return (
    <div>
      <TitleField title={title} />
      <div className="row">
        {properties.map((prop : any) => (
          <div
            className="col-lg-2 col-md-4 col-sm-6 col-xs-12"
            key={prop.content.key}>
            {prop.content}
          </div>
        ))}
      </div>
      {description}
    </div>
  );
}


const log = (type: any) => console.log.bind(console, type);

export class JsonSchemaForm extends React.Component {


  render() {

    return (
      <Form schema={schema}
        // uiSchema={uiSchema}
        ObjectFieldTemplate={ObjectFieldTemplate}
        //  formData={}
        onChange={log("changed")}
        onSubmit={log("submitted")}
        onError={log("errors")} />
    );
  }
}
