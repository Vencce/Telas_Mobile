import React, {useState, useEffect} from "react";
import { KeyboardAvoidingView, View, Image, TouchableOpacity, TextInput, Text, Platform } from 'react-native';
import { css } from "../../assets/css/Css";
import Icon from 'react-native-vector-icons/FontAwesome';

import loginApi from '../../seeders/services/login';
import { userState } from '../recoil/atoms/auth';
export default function Login({navigation}) {
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);

    const setUser = useSetRecoilState(userState);   
    const login = async () => {
      try {
        const data = await loginApi.login(username, password);
        setUser({
          loggedIn: true,
          access: data.access,
          refresh: data.refresh,
        });
        setUsername('');
        setPassword('');
        setErrorMsg(null);
        await SecureStore.setItemAsync('access', data.access);
        navigation.goBack();
      } catch (error) {
        setUser({ loggedIn: false, access: null, refresh: null });
        setErrorMsg('Usuário ou senha inválidos!');
        await SecureStore.deleteItemAsync('access');
      }
    };
    
    return(
        <KeyboardAvoidingView style={[css.container, css.backcolor]}>

            <View style={css.backimg}>
                <Image style={css.imgJS} source={require('../../assets/JSm.png')} />
            </View>

            <View style={css.input}>
                <View style={css.textinput}>
                    <Icon name='user-circle' size={20} color='grey' />
                    <TextInput 
                        style={css.placeholderLogin} 
                        placeholder='Usuário:'
                        value={username}
                        onChangeText={setUsername}  
                    />
                </View>
                <View style={css.textinput}>
                    <Icon name="lock" size={20} color='grey'/>
                    <TextInput 
                        style={css.placeholderLogin} 
                        placeholder='Senha:'
                        secureTextEntry={true}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity style={css.iconeye}>
                        <Icon name="eye" size={20} color='grey' />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity  onPress={() =>  login('AreaRestrita')}>
                    <Text style={css.textinputbtn}>Entrar</Text>
                    <Text>{errorMsg}</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
                <Text style={css.cadastro}>Não tem conta? cadastre-se!</Text>
            </TouchableOpacity>

            <View style={css.nadabranco}></View>    
        </KeyboardAvoidingView>
    );
}