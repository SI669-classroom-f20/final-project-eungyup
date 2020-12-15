import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, LogBox } from 'react-native';
import { loginStyles } from './Styles';
import { getDataModel } from './DataModel';
import Logo from './Logo'

export class LoginScreen extends React.Component {
    constructor(props) {
        super(props);

        this.dataModel = getDataModel();

        this.state = {
            mode: 'login',
            emailInput: '',
            passwordInput: '',
            passwordCheckInput: ''
        }
        // For Android, if there is a large file like a picture it gives this log.
        // However, since this log doesn't affect the app function, make it ignore.
        LogBox.ignoreLogs(['Setting a timer']);
    }

    onCreateAccount = async () => {
        // check that user doesn't already exist
        let users = this.dataModel.getUsers();
        for (let user of users) {
            if (user.email === this.state.emailInput) {
                Alert.alert(
                    'Duplicate User',
                    'User ' + this.state.emailInput + ' already exists.',
                    [{ text: 'OK', style: 'OK' }]
                );
                return;
            }
        } // made it through loop, no user exists!
        let newUser = await this.dataModel.createUser(
            this.state.emailInput,
            this.state.passwordInput
        );
        this.props.navigation.navigate("Home", {
            currentUser: newUser
        });
    }

    onLogin = () => {
        let users = this.dataModel.getUsers();
        let email = this.state.emailInput;
        let pass = this.state.passwordInput;
        for (let user of users) {
            if (user.email === email) {
                if (user.password === pass) {
                    // success!
                    this.props.navigation.navigate("Home", {
                        currentUser: user
                    });
                    return;
                }
            }
        }
        // we got through all the users with no match, so failure
        Alert.alert(
            'Login Failed',
            'No match found for this email and password.',
            [{ text: 'OK', style: 'OK' }]
        );
    }

    render() {
        return (
            <View style={loginStyles.container}>
                {/* Top */}
                <Logo/>

                <ScrollView>
                    {/* Content */}
                    <View style={loginStyles.contentView}>
                        <Text style={loginStyles.welcomeText}>Welcome</Text>
                        <View style={loginStyles.inputRow}>
                            <TextInput
                                style={loginStyles.inputText}
                                keyboardType='email-address'
                                autoCapitalize='none'
                                autoCorrect={false}
                                autoCompleteType='email'
                                textContentType='emailAddress'
                                placeholder='Email Address'
                                value={this.state.emailInput}
                                onChangeText={(text)=>{this.setState({emailInput: text})}}
                            />
                        </View>
                        <View style={loginStyles.inputRow}>
                            <TextInput
                                style={loginStyles.inputText}
                                autoCapitalize='none'
                                autoCorrect={false}
                                textContentType='password'
                                placeholder='Password'
                                value={this.state.passwordInput}
                                // for Android, need to make keyboardType={"default"} to use secureTextEntry = {true}
                                keyboardType={"default"}
                                secureTextEntry = {true}
                                onChangeText={(text)=>{this.setState({passwordInput: text})}}
                            />
                        </View>
                        {this.state.mode === 'create'? 
                            <View style={loginStyles.inputRow}>
                                <TextInput
                                    style={loginStyles.inputText}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    textContentType='password'
                                    placeholder='Re-enter Password'
                                    value={this.state.passwordCheckInput}
                                    // for Android, need to make keyboardType={"default"} to use secureTextEntry = {true}
                                    keyboardType={"default"}
                                    secureTextEntry = {true}
                                    onChangeText={(text)=>{this.setState({passwordCheckInput: text})}}
                                />
                            </View>
                            :
                        <View/>
                        }
                        {/* Bottom */}
                        <View style={loginStyles.bottomView}>
                        {this.state.mode === 'login'?
                            <TouchableOpacity 
                                style={loginStyles.buttonContainer}
                                onPress={this.onLogin}
                            >
                                <Text style={loginStyles.buttonText}>Login</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                style={loginStyles.buttonContainer}
                                onPress={this.onCreateAccount}
                            >
                                <Text style={loginStyles.buttonText}>Create Account</Text>
                            </TouchableOpacity>
                        }
                            <View style={loginStyles.bottomTextContainer}>
                                <Text style={loginStyles.bottomQuestionText}>{this.state.mode === 'login'? "Don't have an account?" : "Already have an account?"}</Text>
                                {this.state.mode === 'login' ?
                                <TouchableOpacity
                                    onPress={()=>{
                                        this.setState({mode: 'create'})
                                    }}
                                >
                                    <Text style={loginStyles.bottomLinkText}>Sign Up Here</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity
                                    onPress={()=>{
                                        this.setState({mode: 'login'})
                                    }}
                                >
                                    <Text style={loginStyles.bottomLinkText}>Login</Text>
                                </TouchableOpacity>
                                }
                            </View>
                        </View>
                    </View>
                    </ScrollView>
                </View>
        )
    }
}