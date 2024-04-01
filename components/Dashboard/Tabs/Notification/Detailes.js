import { StyleSheet, Text, View } from "react-native"

const Detailes = (props) => {
    const { data } = props;
    const { body, title } = data
    return (
        <View style={styles.Container}>
            <View styles={styles.Titlecontainer}>
                <Text style={styles.title}>Title : {title}</Text>
            </View>
            <View >
                <Text style={styles.body}>{body}</Text>
            </View>
        </View>
    )
}

export default Detailes

const styles = StyleSheet.create({
    Container : 
    {
        backgroundColor : '#E0F4FF',
        marginTop : '10%',
        marginBottom : '5%',
        padding : "10%",
        alignItems:'center'
    },
    title : 
    {
        fontSize : 20,
        fontWeight :'bold'
    },
    body : {
        margin : '5%',
        fontSize : 15
    }
})