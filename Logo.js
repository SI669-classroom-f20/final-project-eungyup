import React from 'react';
import { View, Image} from 'react-native';


import { logoStyles } from './Styles';


export default class Logo extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <View style={logoStyles.topView}>
                <Image
                    source={require('./assets/logo.png')}
                    style={logoStyles.logoImage}
                />
            </View>
        )
    }
}