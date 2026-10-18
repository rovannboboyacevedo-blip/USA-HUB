import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import { HubButton } from '@/components/chrome';
import { useRaiseOnHover } from '@/components/useRaiseOnHover';
import { colors, fonts, orgColors, shadow } from '@/constants/theme';
import { audienceLabel, eventImageSource } from '@/services/eventDirectory';
import type { CampusEvent, Organization, Recommendation } from '@/types/models';

type EventCardProps = {
  event: CampusEvent;
  bookmarked: boolean;
  fullWidth?: boolean;
  width?: number;
  onPress: () => void;
  onToggleBookmark: () => void;
};

export const EventCard = ({
  event,
  bookmarked,
  fullWidth = false,
  width,
  onPress,
  onToggleBookmark,
}: EventCardProps) => {
  const imageSource = eventImageSource(event);
  const audience = audienceLabel(event);

  return (
  <View style={[styles.eventCard, fullWidth && styles.eventCardFull, width ? { width } : null]}>
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${event.name}`}
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <View style={[styles.eventBox, imageSource ? styles.eventBoxImage : null]}>
        {imageSource ? (
          <>
            <Image
              accessible={false}
              source={imageSource}
              resizeMode="cover"
              style={styles.eventImage}
            />
            <View pointerEvents="none" style={styles.eventFade} />
          </>
        ) : (
          event.lines.map((line, index) => (
            <Text key={`${event.id}-${index}`} style={styles.eventLine}>
              {line}
            </Text>
          ))
        )}
      </View>
      <View style={styles.eventMeta}>
        <Text style={styles.eventName}>{event.name}</Text>
        <Text style={styles.eventAuthor}>{event.author}</Text>
        {audience ? <Text style={styles.eventAuthor}>{audience}</Text> : null}
      </View>
      <Text style={styles.seeDetails}>See details</Text>
    </Pressable>
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={bookmarked ? `Remove bookmark from ${event.name}` : `Bookmark ${event.name}`}
      accessibilityState={{ selected: bookmarked }}
      hitSlop={8}
      onPress={onToggleBookmark}
      style={styles.starButton}
    >
      <FontAwesome6 name="star" solid={bookmarked} size={16} color={colors.text} />
    </Pressable>
  </View>
  );
};

type OrgCardProps = {
  org: Organization;
  width?: number;
  boxHeight?: number;
  onPress: () => void;
};

export const OrgCard = ({ org, width, boxHeight = 120, onPress }: OrgCardProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={`Open ${org.title}`}
    onPress={onPress}
    style={({ pressed }) => [styles.orgCard, width ? { width } : null, pressed && styles.pressed]}
  >
    {org.coverUri ? (
      <Image
        accessible={false}
        source={{ uri: org.coverUri }}
        resizeMode="cover"
        style={[styles.orgBox, styles.orgCover, { height: boxHeight }]}
      />
    ) : (
      <View style={[styles.orgBox, { backgroundColor: orgColors[org.color], height: boxHeight }]} />
    )}
    <Text style={styles.orgTitle}>{org.title}</Text>
    <Text style={styles.orgCategory}>{org.category}</Text>
  </Pressable>
);

type SuggestionCardProps = {
  item: Recommendation;
  width?: number;
  onPressApply: () => void;
};

export const YouMightLikeBanner = () => {
  const { translateY, handleHoverIn, handleHoverOut, zIndex } = useRaiseOnHover();

  return (
    <Animated.View style={[styles.mightLikeLift, { transform: [{ translateY }], zIndex }]}>
      <Pressable
        accessibilityRole="text"
        accessibilityLabel="You might like"
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        style={styles.mightLike}
      >
        <Text style={styles.mightLikeLabel}>You Might Like</Text>
      </Pressable>
    </Animated.View>
  );
};

export const SuggestionCard = ({ item, width, onPressApply }: SuggestionCardProps) => (
  <View style={[styles.suggestion, width ? { width } : styles.suggestionStretch]}>
    <View style={styles.suggestionHeader}>
      <View style={[styles.thumb, { backgroundColor: orgColors[item.color] }]} />
      <View style={styles.suggestionCopy}>
        <Text style={styles.suggestionName}>{item.name}</Text>
        <Text style={styles.suggestionMeta}>{item.meta}</Text>
      </View>
    </View>
    <HubButton label="Apply for Membership" onPress={onPressApply} />
  </View>
);

const styles = StyleSheet.create({
  eventCard: {
    width: 168,
    position: 'relative',
    paddingBottom: 8,
  },
  eventCardFull: {
    width: '100%',
    marginBottom: 16,
  },
  eventBox: {
    minHeight: 148,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 12,
    justifyContent: 'space-between',
    ...shadow.card,
  },
  eventBoxImage: {
    padding: 0,
    overflow: 'hidden',
    borderWidth: 0,
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  eventImage: {
    width: '100%',
    height: 148,
  },
  eventFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 84,
    backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0), #FFFFFF)',
  },
  eventLine: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 18,
    textTransform: 'uppercase',
    color: colors.text,
  },
  eventMeta: {
    marginTop: 8,
  },
  eventName: {
    fontFamily: fonts.bold,
    fontSize: 12,
    textTransform: 'uppercase',
    color: colors.text,
  },
  eventAuthor: {
    marginTop: 2,
    fontFamily: fonts.medium,
    fontSize: 11,
    textTransform: 'none',
    color: colors.muted,
  },
  seeDetails: {
    marginTop: 8,
    paddingRight: 22,
    fontFamily: fonts.bold,
    fontSize: 11,
    textDecorationLine: 'underline',
    textTransform: 'uppercase',
    color: colors.text,
  },
  starButton: {
    position: 'absolute',
    right: 0,
    bottom: 6,
  },
  orgCard: {
    width: '48%',
  },
  orgBox: {
    height: 120,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  orgCover: {
    width: '100%',
  },
  orgTitle: {
    marginTop: 8,
    fontFamily: fonts.bold,
    fontSize: 13,
    textTransform: 'uppercase',
    color: colors.text,
  },
  orgCategory: {
    marginTop: 2,
    fontFamily: fonts.medium,
    fontSize: 11,
    textTransform: 'none',
    color: colors.muted,
  },
  mightLikeLift: {
    alignSelf: 'stretch',
    borderRadius: 12,
  },
  mightLike: {
    minHeight: 40,
    borderRadius: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    ...shadow.float,
  },
  mightLikeLabel: {
    fontFamily: fonts.bold,
    fontSize: 13,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: colors.text,
  },
  suggestionStretch: {
    alignSelf: 'stretch',
  },
  suggestion: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 16,
    ...shadow.card,
  },
  suggestionHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  thumb: {
    width: 70,
    height: 75,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: colors.border,
  },
  suggestionCopy: {
    flex: 1,
    justifyContent: 'center',
  },
  suggestionName: {
    fontFamily: fonts.bold,
    fontSize: 18,
    lineHeight: 20,
    textTransform: 'uppercase',
    color: colors.text,
  },
  suggestionMeta: {
    marginTop: 6,
    fontFamily: fonts.bold,
    fontSize: 11,
    lineHeight: 15,
    textTransform: 'uppercase',
    color: colors.subtle,
  },
  pressed: {
    opacity: 0.86,
  },
});
