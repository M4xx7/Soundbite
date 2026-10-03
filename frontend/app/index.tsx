import { Link, useRouter } from "expo-router";
import { View, Text, Button } from "react-native";
import { typography } from "./styles/typography";
import PageBtn from "./components/PageBtn";


export default function Index() {

  const router = useRouter();

  return (
    <View>
      <Text style={[typography.title, { marginTop: 100 }]}>Audio analyzer</Text>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 150 }}>
        <PageBtn
          onPress={() => router.push('/transcribe')}
          iconName={'transcript'}
          iconHeight={80}
          iconWidth={80}
        />
        <PageBtn
          onPress={() => router.push('/summarize')}
          iconName={'ai'}
          iconHeight={80}
          iconWidth={80}
        />
      </View>
    </View>
  )
}