import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { bindActionCreators } from 'redux'

import { actions as counterActions } from "../../redux/modules/counter";

import './index.styl';

class ServicePage extends Component {
  config = {
    navigationBarTitleText: '工作台'
  }

  constructor () {
    super(...arguments)
    this.state = {
      imagesList: [
        'https://m.360buyimg.com/babel/jfs/t19189/259/982422064/89206/94ed5482/5ab4f6cbNd323ee06.jpg',
        'https://img1.360buyimg.com/da/jfs/t14950/329/2565843691/99347/46a6681f/5ab21540N21d5240c.jpg'
      ]
    }
  }

  componentDidMount () {
    console.log('service mount')
  }

  componentDidShow () {
    console.log('service show')
  }

  componentDidHide () {
    console.log('service hide')
  }

  componentWillUnmount () {
    console.log('service unmount')
  }

  navigateTo () {
    Taro.navigateTo({
      url: '/pages/auth/AuthPage'
    })
  }

  navigateBack () {
    Taro.navigateBack({
      delta: 1
    })
  }

  render () {
    const { add, minus, asyncAdd } = this.props;
    return (
      <View className='page'>
        <Button className='navigate_btn' onClick={this.navigateTo}>push</Button>
        <Button className='navigate_btn' onClick={this.navigateBack}>back</Button>
        <Button className='add_btn' onClick={add}>+</Button>
        <Button className='dec_btn' onClick={minus}>-</Button>
        <Button className='dec_btn' onClick={asyncAdd}>async</Button>
        <View><Text>{this.props.counter.num}</Text></View>
        <View>
          <Image src={this.state.imagesList[0]} />
        </View>
        <Text>工作台</Text>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    counter: state.counter
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(counterActions, dispatch)
    // ...bindActionCreators(bannerActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ServicePage);
