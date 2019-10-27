import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import Container from '../../components/Container';
import Empty from '../../components/Empty';
import {
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Loading,
} from './styles';

export default function User({ navigation }) {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [user] = useState(navigation.getParam('user'));
  const [stars, setStars] = useState([]);
  const [page, setPage] = useState(1);

  async function loadPage(pageNumber = page, shouldRefresh = false) {
    if (total && pageNumber > total) return;

    if (shouldRefresh) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        page: pageNumber,
      },
    });

    const totalItems = response.data.length;

    setTotal(Math.floor(totalItems / 5));
    setStars(shouldRefresh ? response.data : [...stars, ...response.data]);
    setPage(pageNumber + 1);

    if (shouldRefresh) {
      setLoading(false);
    } else {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    async function loadStars() {
      loadPage();
    }

    loadStars();
  }, []);

  async function refreshList() {
    setRefreshing(true);
    await loadPage(1, true);
    setRefreshing(false);
  }

  function handleNavigate(repository) {
    navigation.navigate('Repository', { repository });
  }

  return (
    <Container>
      <Header>
        <Avatar source={{ uri: user.avatar }} />
        <Name>{user.name}</Name>
        <Bio>{user.bio}</Bio>
      </Header>

      {!loading ? (
        <View>
          {stars.length ? (
            <Stars
              data={stars}
              onEndReachedThreshold={0.2}
              onEndReached={() => loadPage()}
              onRefresh={refreshList}
              refreshing={refreshing}
              ListFooterComponent={loading && <Loading />}
              keyExtractor={star => String(star.id)}
              renderItem={({ item }) => (
                <Starred onPress={() => handleNavigate(item)}>
                  <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                  <Info>
                    <Title>{item.name}</Title>
                    <Author>{item.owner.login}</Author>
                  </Info>
                </Starred>
              )}
            />
          ) : (
            <Empty />
          )}
        </View>
      ) : (
        <Loading />
      )}
    </Container>
  );
}

User.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('user').name,
});

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
