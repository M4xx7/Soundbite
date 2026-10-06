import { Link, useRouter } from "expo-router";
import { View, Text } from "react-native";
import { typography } from "./styles/typography";
import { colors } from "./styles/colors";
import PageBtn from "./components/PageBtn";

export default function Index() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 20 }}>
      <Text style={[typography.title, { marginTop: 100, textAlign: 'center' }]}>Soundbite</Text>
      
      <View style={{ 
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        alignItems: 'center',
        marginTop: -150 
      }}>
        <View style={{ alignItems: 'center' }}>
          <PageBtn
            onPress={() => router.push('/transcribe')}
            iconName={'transcript'}
            iconHeight={80}
            iconWidth={80}
          />
          <Text style={[typography.metric, { marginTop: 12, fontSize: 16 }]}>
            Transcribe
          </Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          <PageBtn
            onPress={() => router.push('/summarize')}
            iconName={'ai'}
            iconHeight={80}
            iconWidth={80}
          />
          <Text style={[typography.metric, { marginTop: 12, fontSize: 16 }]}>
            Summarize
          </Text>
        </View>
      </View>
    </View>
  );
}