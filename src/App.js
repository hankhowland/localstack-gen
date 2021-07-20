import './App.css';
import { useEffect, useState } from 'react';
import data from './data.json';
console.log(data);



function App() {
  const [service, setService] = useState('');
  const [command, setCommand] = useState('s');
  const [detailType, setDetailType] = useState('');
  const [commandText, setCommandText] = useState('');
  const [object, setObject] = useState('');

  function handleServiceSelect(e) {
    setService(e.target.innerHTML);
  }

  function getDTInfo() {
    const DTlist = data.services[service]?.detailTypes
    if (DTlist) {
      var result = DTlist.filter(obj => {
        return obj.name === detailType
      })
      return result[0]
    }
    return undefined
  }

  useEffect(() => {
    setObject(getDTInfo()?.exampleData)
  }, [service, command, detailType])

  useEffect(() => {
    function makeCommand() {
      const endpoint = data.services[service]?.endpoint
      const queueURL = data.services[service]?.queueURL
      console.log(object)
      console.log(JSON.stringify(object))
      if (command ==='send') {
        const dataName = getDTInfo()?.detailField
        const str = `aws --endpoint-url=${endpoint} sqs send-message --queue-url ${queueURL} --message-body '{ "version": "0", "id": "a2a13500-9ad4-f384-new-new", "detail-type": ${detailType}, "source": "guzzle-dev", "account": "188291258129", "time": "2021-04-13T19:38:50Z", "region": "us-west-1", "resources": [], "detail": { "${dataName}": ${JSON.stringify(object)}} }'`
        return str;
      } else if (command === 'read') {
        return `aws --endpoint-url=${endpoint} sqs receive-message --max-number-of-messages 10 --queue-url ${queueURL}`
      } else if (command === 'clear') {
        return `aws --endpoint-url=${endpoint} sqs purge-queue --queue-url ${queueURL}`
      }
    }
    setCommandText(makeCommand());
  }, [command, service, detailType, object])

  return (
    <div className="App">
      <div style={{width: '50%', margin: 'auto'}}>
        <div className="container">
          <h3>What service are you working with?</h3>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div className={(service === 'Orders Service') ? "selectedOption" : "option"} onClick={(e) => {handleServiceSelect(e)}}>Orders Service</div>
            <div className={(service === 'Shops Service') ? "selectedOption" : "option"} onClick={(e) => {handleServiceSelect(e)}}>Shops Service</div>
            <div className={(service === 'Products Service') ? "selectedOption" : "option"} onClick={(e) => {handleServiceSelect(e)}}>Products Service</div>
          </div>
        </div>
        <div className="container">
          <h3>What are you trying to do?</h3>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div className={(command === 'send') ? "selectedOption" : "option"} onClick={(e) => {setCommand('send')}}>send a message</div>
            <div className={(command === 'read') ? "selectedOption" : "option"} onClick={(e) => {setCommand('read')}}>read messages</div>
            <div className={(command === 'clear') ? "selectedOption" : "option"} onClick={(e) => {setCommand('clear')}}>clear the queue</div>
          </div>
        </div>
        {(command === 'send') && 
        <>
          <div className="container">
            <h3>What message?</h3>
            {data.services[service]?.detailTypes.map((DT) => {
              return (
                <div key={DT.name} className={(detailType === DT.name) ? "selectedOption" : "option"} onClick={(e) => {setDetailType(DT.name)}}>{DT.name}</div>
              )
            })}
          </div>

          <div className="container">
            <h3>Enter your js object to send:</h3>
            <textarea 
              cols="50" rows="10"
              onChange={(e) => {setObject(JSON.parse(e.target.value))}} 
              value={JSON.stringify(object)}></textarea>
          </div>
        </>
        }
        <div className="container">
          <h3>Here's your command, sir:</h3>
          <div style={{padding: '5px', backgroundColor: 'lightgrey', textAlign: 'left'}}>{commandText}</div>
        </div>
        <div style={{marginBottom: '100px'}} />
      </div>
      
    </div>
  );
}

export default App;
