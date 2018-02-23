import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Modal from 'react-modal'

configure({ adapter: new Adapter() })

Modal.setAppElement = jest.fn()
